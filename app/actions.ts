'use server'

import { OpenAiRecipe } from "@/types"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function save(recipe: OpenAiRecipe) {
    const prisma = new PrismaClient()

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
  }