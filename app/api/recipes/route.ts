export async function GET(request: Request) {
    const query = request.url.split('?query=')[1]

    const res = await fetch(
		`https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`,
        {
            cache: 'force-cache'
        }
	)

    const data = await res.json()

    return Response.json({ data })
}