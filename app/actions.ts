'use server'

import { OpenAiRecipe } from "@/types"
import { PrismaClient, Recipe } from "@prisma/client"
import { del, put } from "@vercel/blob"
import { error } from "console"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import OpenAI from "openai"
import sharp from "sharp"

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
    const imageFilename = recipe.title.toLowerCase().replace(/ /g, "-") + ".jpeg"

    const compressedImage = await sharp(uncompressedImage)
        .jpeg({ mozjpeg: true })
        .toBuffer()

    // upload image to Vercel Blob Storage
    const blob = await put(imageFilename, compressedImage, {
      access: 'public',
    })

    // update recipe with image URL
    await prisma.recipe.update({
        where: {
            id: recipe.id
        },
        data: {
            image: blob.url
        }
    })

    revalidatePath("/recipes")
}

// delete recipe from database
export async function deleteRecipe(recipe: Recipe) {
    try {
        if (recipe.image) await del(recipe.image)
    } catch (error) {
        console.log("Failed to delete image", error)
    }

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