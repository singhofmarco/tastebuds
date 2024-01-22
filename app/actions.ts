'use server'

import { OpenAiRecipe } from "@/types"
import { PrismaClient, Recipe } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand, PutObjectCommandInput, DeleteObjectCommand, DeleteObjectCommandInput } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"
import OpenAI from "openai"
import sharp from "sharp"

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
            userId: 1 // TODO: replace with user authentication
        }
    })

    revalidatePath("/recipes")

    await generateImage(storedRecipe)

    redirect("/recipes/" + storedRecipe.id)
}

export async function generateImage(recipe: Recipe) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    // generate image using OpenAI's DALL-E 3 model
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: "Create a realistic image of: " + recipe.title,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
    })

    const image_b64 = response.data[0].b64_json

    if (!image_b64) {
        throw new Error("Failed to generate image")
    }

    // compress image
    const uncompressedImage = Buffer.from(image_b64, "base64")
    const compressedImage = await sharp(uncompressedImage)
        .jpeg({ mozjpeg: true })
        .toBuffer()

    // upload image to S3 bucket
    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
        throw new Error("AWS bucket config is not set")
    }

    const bucketName = process.env.AWS_BUCKET_NAME
    const key = uuidv4() + '.jpeg'

    try {
        const params: PutObjectCommandInput = {
            Bucket: bucketName,
            Body: compressedImage,
            Key: key,
            ContentType: 'image/jpeg',
            ACL: 'public-read',
        }

        await s3Client.send(new PutObjectCommand(params))
      } catch (error: any) {
        return Response.json({ error: error.message })
      }

      const url = `https://${bucketName}.s3.amazonaws.com/${key}`

    // update recipe with image URL
    await prisma.recipe.update({
        where: {
            id: recipe.id
        },
        data: {
            image: url
        }
    })

    revalidatePath("/recipes")
}

// delete recipe from database
export async function deleteRecipe(recipe: Recipe) {
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