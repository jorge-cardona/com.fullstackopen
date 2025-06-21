import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_KEY

const getCountries = name => {
  return axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(response => response.data)
}

const getWeather = (capital, cca2) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital},${cca2}&appid=${API_KEY}&units=metric`).then(response => response.data)
}

export default { getCountries, getWeather }