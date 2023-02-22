var searchFieldEl = document.querySelector("#search-input");
var searchBtnEl = document.querySelector("#searchBtn");
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var weatherApiKey = "&appid=bb7d0040d30c625c65c4836bd0556ffe";
var today = dayjs();
var weatherTodayEl = document.querySelector("#today");

$(searchBtnEl).on("click", function (event) {
  event.preventDefault();

  var userSearch =
    weatherUrl +
    searchFieldEl.value +
    "&length=1" +
    weatherApiKey +
    "&units=imperial";
  console.log(userSearch);
  if (!searchFieldEl.value) {
    console.log("please search a city");
  } else {
    fetch(userSearch)
      .then(function (response) {
        return response.json();
      })

      .then(function (data) {
        console.log(data);
        console.log(data.name + data.main.temp);
        var weatherToday = document.createElement("h1");
        weatherToday.textContent = data.name + today.format(" (M / D / YYYY)");
        weatherTodayEl.appendChild(weatherToday);
        var tempToday = document.createElement("h2");
        tempToday.textContent = "Temp: " + data.main.temp + " °F";
        var windToday = document.createElement("h2");
        windToday.textContent = data.wind.speed;
        var humidityToday = document.createElement("h2");
        humidityToday.textContent = data.main.humidity;
        weatherToday.appendChild(tempToday);
      });
  }
});
