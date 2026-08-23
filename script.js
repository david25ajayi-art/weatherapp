// DOM Elements
const cityInput = document.getElementById("city-input");
const suggestions = document.getElementById("suggestions");
const searchButton = document.getElementById("search-btn");
const locationButton = document.getElementById("location-btn");
const cityName = document.getElementById("city-name");
const weatherDescription = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const feelsLike = document.getElementById("feels-like");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const uvIndex = document.getElementById("uv-index");
const weatherIcon=document.getElementById("weather-icon");
const errorMessage = document.getElementById("error-message");
const loadingMessage = document.getElementById("loading-message");
const recentSearches = document.getElementById("recent-list");

let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

function displayRecentSearches() {
    recentSearches.innerHTML = "";
    searches.forEach(function(city) {
        const item = document.createElement("div");
        item.textContent = city;
        item.classList.add("recent-item");

        recentSearches.appendChild(item);
    });
}

// API Key
const apiKey = "YOUR_REAL_API_KEY";

// Function
async function getWeather(city){

    loadingMessage.style.display = "block";

    try{

 const url = `/api/weather?city=${encodeURIComponent(city)}`;

const response = await fetch(url);

const data = await response.json();


if (data.error) {
    errorMessage.textContent = data.error.message;
    errorMessage.style.display = "block";
    loadingMessage.style.display = "none";
    return;
}
const forecastDays = data.forecast.forecastday;

const forecast = document.getElementById("forecast");

forecast.innerHTML = "";

forecastDays.forEach(function(day) {

    const card = document.createElement("div");

    card.classList.add("forecast-card");

    const date = new Date(day.date);
    let dayName;

if (forecastDays.indexOf(day) === 0) {
    dayName = "Today";
}
else if (forecastDays.indexOf(day) === 1) {
    dayName = "Tomorrow";
}
else {
    dayName = date.toLocaleDateString("en-US", {
        weekday: "short"
    });
}

    card.innerHTML = `

    <h3>${dayName}</h3>

    <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">

    <p>${day.day.condition.text}</p>

    <h2>${day.day.maxtemp_c}° / ${day.day.mintemp_c}°</h2>
    <small>Rain: ${day.day.daily_chance_of_rain}%</small>
`;
forecast.appendChild(card);

});
 // Hide any previous error
        errorMessage.style.display = "none";
        //display weather

    cityName.textContent = data.location.name;
    saveRecentSearch(data.location.name);
weatherDescription.textContent = data.current.condition.text;
temperature.textContent = `${data.current.temp_c}°C`;
humidity.textContent = `Humidity: ${data.current.humidity}%`;
windSpeed.textContent = `Wind: ${data.current.wind_kph} km/h`;
feelsLike.textContent = `Feels Like: ${data.current.feelslike_c}°C`;
pressure.textContent = `Pressure: ${data.current.pressure_mb} mb`;
visibility.textContent = `Visibility: ${data.current.vis_km} km`;
uvIndex.textContent = `UV Index: ${data.current.uv}`;
 weatherIcon.src = "https:" + data.current.condition.icon;
    weatherIcon.alt = data.current.condition.text;
    changeBackground(
    data.current.condition.text,
    data.current.is_day
);
    loadingMessage.style.display = "none";
    
    } catch (error) {

    loadingMessage.style.display = "none";

    errorMessage.textContent = "Something went wrong.";
    errorMessage.style.display = "block";

}

}
function changeBackground(condition, isDay) {

    // Remove previous background classes
    document.body.classList.remove(
        "sunny",
        "cloudy",
        "rain",
        "thunder",
        "snow",
        "clear-night"
    );

    condition = condition.toLowerCase();

    if (!isDay) {
        document.body.classList.add("clear-night");
    }
    else if (condition.includes("sun")) {
        document.body.classList.add("sunny");
    }
    else if (condition.includes("cloud")) {
        document.body.classList.add("cloudy");
    }
    else if (condition.includes("rain")) {
        document.body.classList.add("rain");
    }
    else if (condition.includes("thunder")) {
        document.body.classList.add("thunder");
    }
    else if (condition.includes("snow")) {
        document.body.classList.add("snow");
    }

}
async function getSuggestions(query) {

    if (query.length < 2) {
        suggestions.innerHTML = "";
        return;
    }

    const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;

    const response = await fetch(url);

    const data = await response.json();

    suggestions.innerHTML = "";

    data.forEach(function (city) {

    const suggestion = document.createElement("div");

    suggestion.classList.add("suggestion");

    suggestion.textContent = `${city.name}, ${city.country}`;

    suggestion.addEventListener("click", function () {

    cityInput.value = city.name;

    suggestions.innerHTML = "";

    getWeather(city.name);

});

    suggestions.appendChild(suggestion);

});

}

// 👇 Put it HERE
searchButton.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {
        return;
    }

    getWeather(city);

});
document.addEventListener("click", function (event) {

    if (!cityInput.contains(event.target) &&
        !suggestions.contains(event.target)) {

        suggestions.innerHTML = "";

    }

});
// using enter keey to search
cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        searchButton.click();

    }

});
locationButton.addEventListener("click", function () {

    navigator.geolocation.getCurrentPosition(function (position) {

const latitude = position.coords.latitude;
const longitude = position.coords.longitude;

getWeather(`${latitude},${longitude}`);

    });

});
cityInput.addEventListener("input", function () {

    const query = cityInput.value.trim();

    getSuggestions(query);

});
function displayRecentSearches() {
    recentSearches.innerHTML = "";

    if (searches.length === 0) {
        recentSearches.style.display = "none";
        return;
    }

    recentSearches.style.display = "block";

    searches.forEach(function(city) {

        const item = document.createElement("div");

        item.textContent = city;
        item.classList.add("recent-item");

        item.addEventListener("click", function() {
            cityInput.value = city;
            getWeather(city);
        });

        recentSearches.appendChild(item);
    });
}


function saveRecentSearch(city) {

    searches = searches.filter(function(item) {
        return item.toLowerCase() !== city.toLowerCase();
    });

    searches.unshift(city);

    searches = searches.slice(0, 5);

    localStorage.setItem(
        "recentSearches",
        JSON.stringify(searches)
    );

    displayRecentSearches();
}


// Run when the page loads
displayRecentSearches();

if (searches.length > 0) {
    getWeather(searches[0]);
}
