export default async function handler(request) {
    try {

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query");

        if (!query) {
            return new Response(
                JSON.stringify({
                    error: "Search query is required"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const apiKey = process.env.WEATHER_API_KEY;

        if (!apiKey) {
            return new Response(
                JSON.stringify({
                    error: "WEATHER_API_KEY is missing"
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const url =
            `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

        const response = await fetch(url);

        const data = await response.json();

        return new Response(
            JSON.stringify(data),
            {
                status: response.status,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {

        console.error("Search API error:", error);

        return new Response(
            JSON.stringify({
                error: error.message
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
