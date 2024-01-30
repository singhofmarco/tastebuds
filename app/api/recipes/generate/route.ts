import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20 * 1000,
  maxRetries: 0,
})

export async function POST(request: Request) {
  const { query } = await request.json()

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a system to generate a usable recipe based on a request from a user. Return one recipe per request. Adhere to proven ratios of ingredients in cooking and baking. Use the metric system. You may divert from the metric system, if it makes sense for the type of ingredient like bell peppers should be counted as opposed to be weighted, yeast comes in packets. The user request might be a vague description of a dish or baked good but it could also include a list of ingredients the user wants to have incorporated in the recipe. Always output a JSON object which looks like: {  title: string, totalTime: string, cuisineType: string, portions: number, description: string, ingredients: [{name: string, quantity: number, unit: string}], steps: string[] }',
        },
        { role: 'user', content: query },
      ],
      model: 'gpt-3.5-turbo-1106',
      response_format: { type: 'json_object' },
      stream: true,
    })

    const stream = OpenAIStream(response)

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
