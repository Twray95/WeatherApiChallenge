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

//This function takes the information from local storage and dynamically creates buttons for past searches.  It then adds an event listener to each button that will fetch api data and display information the same as the search function.
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

//This function first removes content from the main weather card then dynamically generates elements from the data given by the api.
function addWeatherToday(data) {
  weatherTodayEl.textContent = "";
  var weatherToday = document.createElement("h1");
  weatherToday.classList.add("marginFixer");
  var iconUrlToday = iconUrl + data.weather[0].icon + "@2x.png";
  weatherToday.textContent = data.name + today.format(" (M / D / YYYY)");
  weatherTodayEl.appendChild(weatherToday);
  var weatherImage = document.createElement("img");
  weatherImage.setAttribute("src", iconUrlToday);
  var tempToday = document.createElement("h2");
  tempToday.textContent = "Temp: " + data.main.temp + " °F";
  var windToday = document.createElement("h2");
  windToday.textContent = "Wind: " + data.wind.speed + " MPH";
  var humidityToday = document.createElement("h2");
  humidityToday.textContent = "Humidity: " + data.main.humidity + " %";
  weatherToday.appendChild(weatherImage);
  weatherToday.appendChild(tempToday);
  weatherToday.appendChild(windToday);
  weatherToday.appendChild(humidityToday);
}

//This function clears the forecast card row and then dynamically creates weather cards from the cardArray variable.  At the end it clears the cardArray variable so that future searches don't stack on top of each other.
function addForecastCards(array) {
  cardRowEl.textContent = "";
  for (i = 0; i < array.length; i++) {
    var weatherCard = document.createElement("div");
    weatherCard.classList.add("bg-info");
    weatherCard.classList.add("p-2");
    weatherCard.classList.add("rounded");
    cardRowEl.appendChild(weatherCard);
    var weatherCardDate = document.createElement("h4");
    var dateData = array[i].dt_txt;
    var newDateData = dateData.replace("12:00:00", "");
    weatherCardDate.textContent = newDateData;
    weatherCard.appendChild(weatherCardDate);
    var iconUrlToday = iconUrl + array[i].weather[0].icon + ".png";
    var iconUrlToday2 = iconUrlToday.replace("n.png", "d.png");
    var weatherImage = document.createElement("img");
    weatherImage.setAttribute("src", iconUrlToday2);
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

//This function takes the data from the forecast api and filters out every non 12:00:00 forecast so that you are left noon forecasts for the next 5 days and then pushes those array items into the cardArray variable.
function filter(data) {
  for (i = 0; i < data.list.length; i++) {
    if (data.list[i].dt_txt.includes("12:00:00")) {
      cardArray.push(data.list[i]);
    }
  }
}

//This function adds an event listener that takes the value from the search field and plugs it into parameters for the weather api and the forecast api.
$(searchBtnEl).on("click", function (event) {
  event.preventDefault();
  var userSearch = searchFieldEl.value;
  //The next two lines are to store user searches in local storage so it can be used later to create search history buttons.
  pastSearchArray.push(userSearch);
  localStorage.setItem("pastSearch", JSON.stringify(pastSearchArray));
  //The next two variables are convenience variables to add parameters to the api searches.
  var userSearchURL =
    weatherUrl +
    searchFieldEl.value +
    "&length=1" +
    weatherApiKey +
    "&units=imperial";
  var cardUrl =
    forecastUrl + userSearch + "&length=5" + weatherApiKey + "&units=imperial";
  // This if statement prevents the user from searching with an empty field.
  if (!searchFieldEl.value) {
    console.log("please search a city");
    return;
  } else {
    fetch(userSearchURL)
      .then(function (response) {
        return response.json();
      })
      // This then function takes the data from the response and passes it into the addWeatherToday function defined above.
      .then(function (data) {
        addWeatherToday(data);
      });
    fetch(cardUrl)
      .then(function (response) {
        return response.json();
      })
      //This then function takes the data from the forecast api and passes it into the filter function and then calls the addForecastCards function with the cardArray argument that was filled in by filter(data) function.
      .then(function (data) {
        filter(data);
        addForecastCards(cardArray);
      });
  }
  cityBtn();
  searchFieldEl.value = "";
});

//This creates buttons of past searches from local storage on page load.
cityBtn();
