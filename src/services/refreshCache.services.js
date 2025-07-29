import { getWeatherData } from "./externalApi.services.js";
const refreshCache = async function() {
    const cities = ['Hyderabad', 'New York', 'Islington', 'Sydney', 'Moscow','Kolkata'];
  
    cities.forEach(async (city) => {
      try {
        await getWeatherData(city);
        console.log(`Cache refreshed for ${city}`);
      } catch (error) {
        console.error(`Failed to refresh weather data for ${city}`);
      }
    });
  }


export {refreshCache};