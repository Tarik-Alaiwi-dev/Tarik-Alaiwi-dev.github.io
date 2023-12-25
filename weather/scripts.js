let inputElement = document.getElementById("input");
let tempValue = document.querySelector(".temp");
let humidityValue = document.getElementById("humidity");
let windValue = document.getElementById("wind");
let cityName = document.querySelector(".place");

let city = "London";
let apiKey = "8043277f2aa535f922c96a6256c67668";

let lat = 0;
let lon = 0;

let temp = 0;
let humidity = 0;
let wind = 0;

async function checkCity(city) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`);
    const cityData = await response.json();
    console.log(cityData);
    lat = Number(cityData[0].lat);
    lon = Number(cityData[0].lon);
    console.log(lat);
    console.log(lon);
}

async function checkWeather() {
    inputElement = document.getElementById("input").value;
    city = inputElement;
    checkCity(city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const cityWeather = await response.json();
    console.log(cityWeather);
    console.log(cityWeather.list[0].main.temp);
    console.log(cityWeather.list[0].main.humidity + "%");
    console.log(cityWeather.list[0].wind.speed + "km/h");
    temp = (cityWeather.list[0].main.temp - 272.15).toFixed(1);
    humidity = cityWeather.list[0].main.humidity;
    wind = cityWeather.list[0].wind.speed;
    //assign city weather values
    cityName.innerHTML = city;
    tempValue.innerHTML = temp + "&degC";
    humidityValue.innerHTML = humidity + "%";
    windValue.innerHTML = wind + "km/h";
    //console.log(temp.toFixed(1));
}

checkWeather();

function clicked(){
    inputElement = document.getElementById("input").value;
    console.log(inputElement);
}
