const APIKey = "2911c69a549d605a7b39cee66f6fdeae";
var cityNameEl = document.getElementById("city-name");
var icon = document.getElementById("icon");

var currentTemp = document.getElementById("temp");
var currentWind = document.getElementById("wind");
var currentHumidity = document.getElementById("humidity");
var currentWeather = document.getElementById("current-weather");
var uvIndexNow = document.getElementById("UV-index");

var enterCity = document.getElementById("enter-city");
var searchBtn = document.getElementById("search-button");
var fivedayForecast = document.getElementById("fiveday-forecast");
var historySearch = document.getElementById("history");
var clearHistory = document.getElementById("clear-history");
var searchesEl = JSON.parse(localStorage.getItem("search")) || [];

function showWeather(cityName) {
    var openWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(openWeatherURL)
            .then(function (response) {

                currentWeather.classList.remove("d-none");
                var currentDate = new Date(response.data.dt * 1000);
                var currentDay = currentDate.getDate();
                var currentMonth = currentDate.getMonth() + 1;
                var currentYear = currentDate.getFullYear();
                cityNameEl.innerHTML = response.data.name + " (" + currentMonth + "/" + currentDay + "/" + currentYear + ") ";
                
                var weatherIcon = response.data.weather[0].icon;
                icon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                icon.setAttribute("alt", response.data.weather[0].description);
            
                currentTemp.innerHTML = "Temp: " + random(response.data.main.temp) + " &#176F";
                currentWind.innerHTML = "Wind: " + response.data.wind.speed + " MPH";
                currentHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
               
                var lat = response.data.coord.lat;
                var lon = response.data.coord.lon;
                var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";

                axios.get(uvIndexURL)
                    .then(function (response) {
                        var uvIndex = document.createElement("span");
                        
                        if (response.data[0].value < 4 ) {
                            uvIndex.setAttribute("class", "badge badge-success");
                        }
                        else if (response.data[0].value < 8) {
                            uvIndex.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            uvIndex.setAttribute("class", "badge badge-danger");
                        }
                        console.log(response.data[0].value)
                        uvIndex.innerHTML = response.data[0].value;
                        uvIndexNow.innerHTML = "UV Index: ";
                        uvIndexNow.append(uvIndex);
                    });
                
                var citynameID = response.data.id;
                var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + citynameID + "&appid=" + APIKey;
                axios.get(fiveDayURL)
                    .then(function (response) {
                        fivedayForecast.classList.remove("d-none");
                        
                        const forecastFive = document.querySelectorAll(".five-day");
                        for (i = 0; i < forecastFive.length; i++) {
                            forecastFive[i].innerHTML = "";
                            const futureUVIndex = i * 8 + 4;
                            const futureDate = new Date(response.data.list[futureUVIndex].dt * 1000);
                            const futureDay = futureDate.getDate();
                            const futureMonth = futureDate.getMonth() + 1;
                            const futureYear = futureDate.getFullYear();
                            const futureDateEl = document.createElement("h5");
                            futureDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            futureDateEl.innerHTML = futureMonth + "/" + futureDay + "/" + futureYear;
                            forecastFive[i].append(futureDateEl);

                            const futureWeather = document.createElement("img");
                            futureWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[futureUVIndex].weather[0].icon + "@2x.png");
                            futureWeather.setAttribute("alt", response.data.list[futureUVIndex].weather[0].description);
                            forecastFive[i].append(futureWeather);

                            const futureTemp = document.createElement("p");
                            futureTemp.innerHTML = "Temp: " + random(response.data.list[futureUVIndex].main.temp) + " &#176F";
                            forecastFive[i].append(futureTemp);

                            const futureWindspeed = document.createElement("p");
                            futureWindspeed.innerHTML = "Wind: " + response.data.list[futureUVIndex].wind.speed + "MPH";
                            forecastFive[i].append(futureWindspeed);

                            const futureHumidity = document.createElement("p");
                            futureHumidity.innerHTML = "Humidity: " + response.data.list[futureUVIndex].main.humidity + "%";
                            forecastFive[i].append(futureHumidity);
                        }
                    })
            });
    }

    searchBtn.addEventListener("click", function () {
        const searchItem = enterCity.value;
        showWeather(searchItem);
        searchesEl.push(searchItem);
        localStorage.setItem("search", JSON.stringify(searchesEl));
        renderSearchesEl();
    })

    function random(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchesEl() {
        historySearch.innerHTML = "";
        for (var i = 0; i < searchesEl.length; i++) {
            const historySearchEl = document.createElement("input");
            historySearchEl.setAttribute("type", "text") ;
            historySearchEl.setAttribute("readonly", true);
            historySearchEl.setAttribute("class", "form-control d-block btn");
            historySearchEl.setAttribute("value", searchesEl[i]);
            historySearchEl.addEventListener("click", function () {
                showWeather(historySearchItem.value);
            })
            historySearch.append(historySearchEl);
        }
    }

    renderSearchesEl();
    if (searchesEl.length > 0) {
        showWeather(searchesEl[searchesEl.length - 1]);
    }
   
    clearHistory.addEventListener("click", function () {
        localStorage.clear();
        searchesEl = [];
        renderSearchesEl();
    })