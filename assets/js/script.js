var searchFieldEl = document.querySelector("#search-input");
var searchBtnEl = document.querySelector("#searchBtn");
var pastSearchEl = document.querySelector("#pastSearches");
var cardRowEl = document.querySelector("#cardRow");
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var weatherApiKey = "&appid=bb7d0040d30c625c65c4836bd0556ffe";
var today = dayjs();
var iconUrl = "http://openweathermap.org/img/wn/";
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
    var cardUrl =
      forecastUrl +
      userSearch +
      "&length=5" +
      weatherApiKey +
      "&units=imperial";
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
        filter(data);
        addForecastCards(cardArray);
      });
  });
}

function addWeatherToday(data) {
  weatherTodayEl.textContent = "";
  var weatherToday = document.createElement("h1");
  var iconUrlToday = iconUrl + data.weather[0].icon + "@2x.png";
  weatherToday.textContent = data.name + today.format(" (M / D / YYYY)");
  weatherTodayEl.appendChild(weatherToday);
  var weatherImage = document.createElement("img");
  weatherImage.setAttribute("src", iconUrlToday);
  weatherToday.appendChild(weatherImage);
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

function addForecastCards(array) {
  cardRowEl.textContent = "";
  for (i = 0; i < array.length; i++) {
    var weatherCard = document.createElement("div");
    weatherCard.classList.add("col-2");
    cardRowEl.appendChild(weatherCard);
    var weatherCardDate = document.createElement("h4");
    var dateData = array[i].dt_txt;
    var newDateData = dateData.replace("12:00:00", "");
    weatherCardDate.textContent = newDateData;
    weatherCard.appendChild(weatherCardDate);
    var iconUrlToday = iconUrl + array[i].weather[0].icon + ".png";
    var weatherImage = document.createElement("img");
    weatherImage.setAttribute("src", iconUrlToday);
    weatherCard.appendChild(weatherImage);
    var weatherCardTemp = document.createElement("h6");
    weatherCardTemp.textContent = "Temp: " + array[i].main.temp + " °F";
    weatherCard.appendChild(weatherCardTemp);
    var weatherCardWind = document.createElement("h6");
    weatherCardWind.textContent = "Wind: " + array[i].wind.speed + " MPH";
    weatherCard.appendChild(weatherCardWind);
    var weatherCardHumidity = document.createElement("h6");
    weatherCardHumidity.textContent =
      "Humidity: " + array[i].main.humidity + " %";
    weatherCard.appendChild(weatherCardHumidity);
  }
  cardArray.length = 0;
}

function filter(data) {
  for (i = 0; i < data.list.length; i++) {
    if (data.list[i].dt_txt.includes("12:00:00")) {
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
  if (!searchFieldEl.value) {
    console.log("please search a city");
  } else {
    fetch(userSearchURL)
      .then(function (response) {
        return response.json();
      })

      .then(function (data) {
        console.log(data);
        addWeatherToday(data);
      });
    fetch(cardUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        filter(data);
        addForecastCards(cardArray);
      });
  }
  cityBtn();
});

cityBtn();
