export default async function handler(request, response) {
    const query = request.query.query;

    if (!query) {
        return response.status(400).json({
            error: "Search query is required"
        });
    }

    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
        return response.status(500).json({
            error: "WEATHER_API_KEY is missing"
        });
    }

    try {
        const url =
            `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

        const weatherResponse = await fetch(url);
        const data = await weatherResponse.json();

        return response.status(weatherResponse.status).json(data);

    } catch (error) {
        console.error("Search API error:", error);

        return response.status(500).json({
            error: "Something went wrong",
            details: error.message
        });
    }
}
