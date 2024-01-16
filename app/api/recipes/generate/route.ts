import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function GET(request: Request) {
    const query = request.url.split('?query=')[1]

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a system to generate a usable recipe based on a request from a user. Return one recipe per request. Adhere to proven ratios of ingredients in cooking and baking. Use the metric system. You may divert from the metric system, if it makes sense for the type of ingredient like bell peppers should be counted as opposed to be weighted, yeast comes in packets. The user request might be a vague description of a dish or baked good but it could also include a list of ingredients the user wants to have incorporated in the recipe. Always output a JSON object which looks like: {  title: string, ingredients: string[], steps: string[], totalTime: string, cuisineType: string, description: string }" },
            { role: "user", content: query },
        ],
        model: "gpt-3.5-turbo-1106",
        response_format: {type: "json_object"},
    })

    console.log(completion.choices[0])

    const data = JSON.parse(completion.choices[0].message.content ?? "")

    return Response.json({ data })
}