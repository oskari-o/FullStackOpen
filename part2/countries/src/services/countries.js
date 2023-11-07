import axios from 'axios';

const COUNTRY_BASE_URL = 'https://studies.cs.helsinki.fi/restcountries/api/';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?q=';
const WEATHER_ICON_BASE_URL = 'http://openweathermap.org/img/wn/';
const WEATHER_API_KEY = import.meta.env.VITE_SOME_KEY;
console.log(WEATHER_API_KEY);

const getAllNames = () => {
    const response = axios
    .get(`${COUNTRY_BASE_URL}all`)
    .then(response => {
        const names = response.data.map(country => country.name.common)
        return names
    })
    return response
}

const getCountry = (name) => {
    const response = axios
    .get(`${COUNTRY_BASE_URL}name/${name.toLowerCase()}`)
    .then(response => {
        const country = response.data
        return country
    })
    return response
}

const getWeather = (capitalName) => {
    const response = axios
    .get(`${WEATHER_BASE_URL}${capitalName}&units=metric&appid=${WEATHER_API_KEY}`)
    .then(response => {
        const weather = response.data
        const weatherObject = {
            capital: capitalName,
            temperature: weather.main.temp,
            windSpeed: weather.wind.speed,
            weatherIconUrl: `${WEATHER_ICON_BASE_URL}${weather.weather[0].icon}@2x.png`
        }
        return weatherObject
    })
    return response
}

export default { getAllNames, getCountry, getWeather };

