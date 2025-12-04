const express = require("express");
const router = express.Router();
const request = require("request");

let apiKey = "75982d686fe968824828b70f7ad53e28";

// Show weather page
router.get("/", function(req, res) {
    const city = req.query.city || "London"; // default city

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function(err, response, body) {
        if (err) {
            return res.render("weather.ejs", {
                weatherData: null,
                error: "Error: could not reach the API"
            });
        }

        const weather = JSON.parse(body);

        if (weather.cod !== 200) {
            return res.render("weather.ejs", {
                weatherData: null,
                error: "City not found"
            });
        }

        const weatherData = {
            city: weather.name,
            temperature: weather.main.temp,
            condition: weather.weather[0].description,
            humidity: weather.main.humidity
        };

        res.render("weather.ejs", {
            weatherData,
            error: null
        });
    });
});

module.exports = router;
