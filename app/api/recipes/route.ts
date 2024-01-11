import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function GET(request: Request) {
    const query = request.url.split('?query=')[1]

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a system to generate a recipe based on a request from a user. Return one recipe per request. Use the metric system. The user request might be a vague description of a dish but it could also include a list of ingredients the user wants to have incorporated in the dish. You may generate a dish that requires ingredients other than what the user specified unless instructed to only include the ingredients listed. Always output a JSON object which looks like: {  title, ingredients, steps, totalTime, cuisineType }" },
            { role: "user", content: query },
        ],
        model: "gpt-4-1106-preview",
        response_format: {type: "json_object"},
    })

    console.log(completion.choices[0])

    const data = JSON.parse(completion.choices[0].message.content ?? "")

    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: data.title,
        n: 1,
        size: "1024x1024",
        response_format: "url"
    });

    const image_url = response.data[0].url;


    return Response.json({ data, image_url })
}