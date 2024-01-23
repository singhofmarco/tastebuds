'use server'

import { OpenAiRecipe } from "@/types"
import { PrismaClient, Recipe } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import { S3Client, DeleteObjectCommand, DeleteObjectCommandInput } from "@aws-sdk/client-s3"
import { Client as QstashClient } from "@upstash/qstash"

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    },
    region: process.env.AWS_REGION
})

const prisma = new PrismaClient()

export async function save(recipe: OpenAiRecipe) {
    const { title, description, image, ingredients, steps, totalTime, cuisineType } = recipe

    const storedRecipe = await prisma.recipe.create({
        data: {
            title,
            description,
            steps,
            ingredients,
            totalTime,
            cuisineType,
            image,
            userId: 1, // TODO: replace with user authentication
        }
    })

    revalidatePath("/recipes")

    await generateImage(storedRecipe.id, title)

    redirect("/recipes/" + storedRecipe.id)
}

export async function generateImage(recipeId: number, title: string) {
    const DALL_E = "https://api.openai.com/v1/images/generations";

    if (!process.env.QSTASH_TOKEN) {
        throw new Error("Qstash token is not set")
    }

    const client = new QstashClient({ token: process.env.QSTASH_TOKEN });
    const res = await client.publishJSON({
        url: DALL_E,
        body: {
            model: "dall-e-3",
            prompt: "Create a realistic image of: " + title,
            n: 1,
            size: "1024x1024",
            response_format: "url"
          },
        headers: {
            "Content-Type": "application/json",
            "Upstash-Forward-Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        callback: `${process.env.CALLBACK_BASE_URL}/api/recipes/image/callback`,
        method: "POST",
    }).catch((error) => {
        throw new Error("Failed to generate image")
    })

    await prisma.recipe.update({
        where: {
            id: recipeId
        },
        data: {
            qStashMessageId: res.messageId
        }
    })

    revalidatePath(`/recipes/${recipeId}`)
}

// delete recipe from database
export async function deleteRecipe(recipeId: number) {
    const recipe = await prisma.recipe.findUnique({
        where: {
            id: recipeId
        }
    })

    if (!recipe) {
        return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // check if recipe belongs to user
    // TODO: replace with user authentication
    if (recipe.userId !== 1) {
        return NextResponse.json({ error: "You are not authorized to delete this recipe" }, { status: 401 })
    }

    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
        throw new Error("AWS bucket config is not set")
    }

    // delete image from S3 bucket
    try {
        if (recipe.image) {
            const params: DeleteObjectCommandInput = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: recipe.image.split('/').pop()
            }

            await s3Client.send(new DeleteObjectCommand(params))
        }
    } catch (error) {
        console.log("Failed to delete image", error)
    }

    // delete recipe from database
    try {
        await prisma.recipe.delete({
            where: {
                id: recipe.id
            }
        })
    } catch (error) {
        throw new Error("Failed to delete recipe")
    }

    revalidatePath("/recipes")

    return redirect("/recipes")
}