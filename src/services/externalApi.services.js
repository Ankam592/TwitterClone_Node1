import {LRUCache} from 'lru-cache';//A Least Recently Used (LRU) cache is imported from the lru-cache library
import axios from'axios'; //The axios library is used to make HTTP requests to the OpenWeatherMap API to retrieve weather data.

const cache = new LRUCache({
  max: 6,   // Max number of items the cache can hold
  maxAge: 10 * 60 * 1000 // Cache data expiration time (10 minutes)
});

const API_KEY = 'bd6337ae43c6dd3fe16c63c930397dea';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

async function getWeatherData(city) {
  const cachedData = cache.get(city);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;
    const weatherInfo = {
      city: city,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      rainChance: data.weather[0].description
    };

    cache.set(city, weatherInfo);
    return weatherInfo;
  } catch (error) {
    console.error(`Error fetching weather data for ${city}: ${error.message}`);
    throw error;
  }
}

export {
  getWeatherData
};
