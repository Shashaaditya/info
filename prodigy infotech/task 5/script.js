function getWeather() {
    const apiKey = '1de8876972bd1a69dc3332b45c1c5bd3';
    const city = document.getElementById('city').value.trim();  // Trim to remove extra spaces

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please enter a valid city name.');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert(error.message);
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found for forecast. Please enter a valid city name.');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert(error.message);
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    if (weatherInfoDiv && tempDivInfo && hourlyForecastDiv && weatherIcon) {
        weatherInfoDiv.innerHTML = '';
        hourlyForecastDiv.innerHTML = '';
        tempDivInfo.innerHTML = '';

        if (data.cod === '404') {
            weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        } else {
            const cityName = data.name;
            const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

            tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
            weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
            weatherIcon.src = iconUrl;
            weatherIcon.alt = description;
            weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
        }
    } else {
        console.error('One or more elements are missing in the HTML.');
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    if (hourlyForecastDiv) {
        const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)
        let hourlyHtml = '';

        next24Hours.forEach(item => {
            const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
            const hour = dateTime.getHours();
            const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            hourlyHtml += `
                <div class="hourly-item">
                    <span>${hour}:00</span>
                    <img src="${iconUrl}" alt="Hourly Weather Icon">
                    <span>${temperature}°C</span>
                </div>
            `;
        });

        hourlyForecastDiv.innerHTML = hourlyHtml;
    } else {
        console.error('Hourly forecast element is missing in the HTML.');
    }
}
