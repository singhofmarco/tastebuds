'use server'

import { OpenAiRecipe } from "@/types"
import { PrismaClient, Recipe } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import OpenAI from "openai"

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

    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: "Create a realistic image of: " + recipe.title,
        n: 1,
        size: "1024x1024",
        response_format: "url"
    })

    const image_url = response.data[0].url

    // update recipe
    await prisma.recipe.update({
        where: {
            id: recipe.id
        },
        data: {
            image: image_url
        }
    })

    revalidatePath("/recipes")
}