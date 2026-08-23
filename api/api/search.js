export default async function handler(req, res) {

    const query = req.query.query;

    if (!query) {
        return res.status(400).json({
            error: "Search query is required"
        });
    }

    const apiKey = process.env.WEATHER_API_KEY;

    try {

        const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

        const response = await fetch(url);

        const data = await response.json();

        return res.status(response.status).json(data);

    } catch (error) {

        return res.status(500).json({
            error: "Something went wrong"
        });

    }
}
