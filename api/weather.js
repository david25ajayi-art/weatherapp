export default async function handler(req, res) {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({
            error: "City is required"
        });
    }

    const apiKey = process.env.WEATHER_API_KEY;

    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3&aqi=no`;

        const response = await fetch(url);
        const data = await response.json();

        return res.status(response.status).json(data);

    } catch (error) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}
