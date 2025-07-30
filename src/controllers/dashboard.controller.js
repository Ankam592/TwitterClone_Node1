// import { getWeatherData } from '../services/externalApi.services.js'

// // const refreshDashboardPage = async function (req,res) 
// // {
// //     console.log("refresh")
// //     res.render('/WeatherApp/dashboardPage/dashboard');
// // }

// const dashboardPage = async function (req, res) {
//     try {
//         const cities = ['Hyderabad', 'New York', 'Islington', 'Sydney', 'Moscow','Kolkata'];
//         const weatherData = [];

//         for (const city of cities) {

//             const weather = await getWeatherData(city); // Use the service
//             weatherData.push(weather);
//         }

//         return res.status(201).render('dashboard', { 'weatherInfo': weatherData })
//     }
//     catch (error) {
//         return res.status(500).send(`error will sending weather report`)
//     }
// }

// export { dashboardPage }