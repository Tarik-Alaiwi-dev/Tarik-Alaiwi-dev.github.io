let inputElement = document.getElementById("input");
let tempValue = document.querySelector(".temp");
let humidityValue = document.getElementById("humidity");
let windValue = document.getElementById("wind");
let cityName = document.querySelector(".place");
let image = document.getElementById("image");

let city = "Olsztyn";
let apiKey = "8043277f2aa535f922c96a6256c67668";

let temp = 0;
let humidity = 0;
let wind = 0;
let clouds = 0;

// async function checkCity(city) {
//     const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`);
//     const cityData = await response.json();
//     console.log(cityData);
//     lat = Number(cityData[0].lat);
//     lon = Number(cityData[0].lon);
//     console.log(lat);
//     console.log(lon);
// }

async function checkWeather(i) {
    if(i===1){
        inputElement = document.getElementById("input");
        city = inputElement.value;
    }
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`);
    const cityWeather = await response.json();
    //check if city in input is recognised in api
    if(cityWeather.cod == 404){
        document.querySelector(".err").classList.add("err-display");
        inputElement.value = "";
        return;
    }
    document.querySelector(".err").classList.remove("err-display");

    console.log(cityWeather);
    console.log(cityWeather.main.temp);
    console.log(cityWeather.main.humidity + "%");
    console.log(cityWeather.wind.speed + "km/h");
    temp = Math.round(cityWeather.main.temp);
    humidity = cityWeather.main.humidity;
    wind = cityWeather.wind.speed;
    //check clouds and display proper image
    clouds = cityWeather.clouds.all;
    console.log(clouds);
    if(clouds>=80){
        image.src = "./images/sun.webp";
        image.alt = "sun";
    }else if(clouds<80 && clouds>=60){
        image.src = "./images/little-cloudy.webp";
        image.alt = "little";
    }else if(clouds<60 && clouds>=40){
        image.src = "./images/very-cloudy.webp";
        image.alt = "very-cloudy";
    }else{
        image.src = "./images/cloudy.webp";
        image.alt = "cloudy";
    }
    //assign city weather values
    city = city[0].toUpperCase() + city.toLowerCase().slice(1);
    cityName.innerHTML = city;
    tempValue.innerHTML = temp + "&deg";
    humidityValue.innerHTML = humidity + "%";
    windValue.innerHTML = wind + "km/h";
    //clear input
    inputElement.value = "";
}

checkWeather(0);

function handleKeyDown(event){
    if(event.key === "Enter" || event.keyCode ===13){
        checkWeather(1);
    }
}

document.addEventListener("keydown", handleKeyDown);
