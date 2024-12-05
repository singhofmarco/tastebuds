import { validateRequest } from '@/auth'
import { createOpenAI } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { recipeSchema } from '../schema'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const requestSchema = z.object({
  prompt: z.string().max(100),
  diet: z.enum([
    'omnivore',
    'vegetarian',
    'vegan',
    'pescatarian',
    'ketogenic',
    'paleo',
  ]),
})

export async function POST(request: Request) {
  const { user } = await validateRequest()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  const validatedRequest = requestSchema.safeParse(data)

  if (!validatedRequest.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { prompt, diet } = validatedRequest.data

  const result = streamObject({
    system:
      'You are a system to generate a usable recipe based on a request from a user. ' +
      'Return one recipe per request. ' +
      'The recipe should be compatible with a ${diet} diet, if not, adapt it. ' +
      'Adhere to proven ratios of ingredients in cooking and baking. ' +
      'The user request might be a vague description of a dish or baked good ' +
      'but it could also include a list of ingredients the user wants to have incorporated in the recipe. ' +
      'The request may also look like: "Cook something fun" or "Something Italian". ' +
      'If the request is not compatible with the diet, create an adapted recipe. ' +
      'The recipe should always be for 4 portions in cooking. ' +
      'Always try to create a recipe. ' +
      'Never respond with a question.',
    prompt: 'I want to cook or bake: ' + prompt,
    model: openai.languageModel('gpt-3.5-turbo-1106'),
    mode: 'json',
    maxRetries: 0,
    schema: recipeSchema,
  })

  return result.toTextStreamResponse()
}
