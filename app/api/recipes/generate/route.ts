import { validateRequest } from '@/auth'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20 * 1000,
  maxRetries: 0,
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

  try {
    // check if prompt violates OpenAI's content policy
    const moderationResponse = await openai.moderations.create({
      model: 'text-moderation-latest',
      input: [prompt, diet],
    })

    if (
      moderationResponse?.results?.[0].flagged ||
      moderationResponse?.results?.[1].flagged
    ) {
      return NextResponse.json(
        { error: 'Your query does not conform to our content policy.' },
        { status: 400 }
      )
    }

    // if not, generate recipe
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a system to generate a usable recipe based on a request from a user. Return one recipe per request. The recipe should be compatible with a ${diet} diet, if not, adapt it. Adhere to proven ratios of ingredients in cooking and baking. Use the metric system. You may divert from the metric system, if it makes sense for the type of ingredient like bell peppers should be counted as opposed to be weighted, yeast comes in packets. The user request might be a vague description of a dish or baked good but it could also include a list of ingredients the user wants to have incorporated in the recipe. The request may also look like: "Cook something fun" or "Something Italian". If the request is not compatible with the diet, create an adapted recipe. The recipe should always be for 4 portions in cooking. Output a JSON object which looks like: {  title: string, totalTime: string, cuisineType: string, portions: number, description: string, ingredients: [{name: string, quantity: number, unit: string}], steps: string[] }. Always try to create a recipe. Only if the request is unrelated to cooking or baking, e.g. "test", or cannibalism, return an error message in JSON: {error:string}. Never respond with a question.`,
        },
        { role: 'user', content: 'I want to cook or bake: ' + prompt },
      ],
      model: 'gpt-3.5-turbo-1106',
      response_format: { type: 'json_object' },
      stream: true,
    })

    const stream = OpenAIStream(response, {
      onCompletion: (result) => {
        console.log(result)
      },
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error
      return NextResponse.json({ name, status, headers, message }, { status })
    } else {
      throw error
    }
  }
}
