var searchFieldEl = document.querySelector("#search-input");
var searchBtnEl = document.querySelector("#searchBtn");
var pastSearchEl = document.querySelector("#pastSearches");
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var weatherApiKey = "&appid=bb7d0040d30c625c65c4836bd0556ffe";
var today = dayjs();
var todayFilter = today.format("YYYY-MM-DD ");
var weatherTodayEl = document.querySelector("#today");
var pastSearchArray = [];
var cardArray = [];

function cityBtn() {
  var cityList = JSON.parse(localStorage.getItem("pastSearch"));
  pastSearchEl.textContent = "";
  for (i = 0; i < cityList.length; i++) {
    var btnDiv = document.createElement("div");
    btnDiv.classList.add("form-group");
    pastSearchEl.appendChild(btnDiv);
    var cityBtnEl = document.createElement("button");
    cityBtnEl.classList.add("btn");
    cityBtnEl.classList.add("btn-secondary");
    cityBtnEl.classList.add("btn-block");
    cityBtnEl.classList.add("pastBtnSearch");
    cityBtnEl.textContent = cityList[i];
    btnDiv.appendChild(cityBtnEl);
  }
  $(".pastBtnSearch").on("click", function (event) {
    event.preventDefault();
    var userSearch = event.target.innerText;
    var userSearchURL =
      weatherUrl + userSearch + "&length1" + weatherApiKey + "&units=imperial";
    fetch(userSearchURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        addWeatherToday(data);
      });
  });
}

function addWeatherToday(data) {
  weatherTodayEl.textContent = "";
  var weatherToday = document.createElement("h1");
  weatherToday.textContent = data.name + today.format(" (M / D / YYYY)");
  weatherTodayEl.appendChild(weatherToday);
  var tempToday = document.createElement("h2");
  tempToday.textContent = "Temp: " + data.main.temp + " °F";
  var windToday = document.createElement("h2");
  windToday.textContent = "Wind: " + data.wind.speed + " MPH";
  var humidityToday = document.createElement("h2");
  humidityToday.textContent = "Humidity: " + data.main.humidity + " %";
  weatherToday.appendChild(tempToday);
  weatherToday.appendChild(windToday);
  weatherToday.appendChild(humidityToday);
}

function filter(data) {
  for (i = 0; i < data.list.length; i++) {
    if (data.list[i].dt_txt.includes("12:00:00")) {
      console.log(data.list[i].main.temp);
      cardArray.push(data.list[i]);
    }
  }
  console.log(cardArray);
}

$(searchBtnEl).on("click", function (event) {
  event.preventDefault();
  var userSearch = searchFieldEl.value;
  pastSearchArray.push(userSearch);
  localStorage.setItem("pastSearch", JSON.stringify(pastSearchArray));
  var userSearchURL =
    weatherUrl +
    searchFieldEl.value +
    "&length=1" +
    weatherApiKey +
    "&units=imperial";
  var cardUrl =
    forecastUrl + userSearch + "&length=5" + weatherApiKey + "&units=imperial";
  console.log(cardUrl);
  if (!searchFieldEl.value) {
    console.log("please search a city");
  } else {
    fetch(userSearchURL)
      .then(function (response) {
        return response.json();
      })

      .then(function (data) {
        addWeatherToday(data);
      });
    fetch(cardUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        filter(data);
      });
  }
  cityBtn();
});

cityBtn();
