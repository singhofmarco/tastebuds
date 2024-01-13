'use server'

import { OpenAiRecipe } from "@/types"
import { PrismaClient } from "@prisma/client"

export async function save(recipe: OpenAiRecipe, image: string) {
    const prisma = new PrismaClient()

    const { title, description, ingredients, steps, totalTime, cuisineType } = recipe

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
  }