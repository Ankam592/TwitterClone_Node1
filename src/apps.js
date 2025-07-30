import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import path from 'path'
import jwt from 'jsonwebtoken'

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { refreshCache } from "./services/refreshCache.services.js"

const app = express()             // server or express application insance is created used to define routes , middlewares and configure server 

// Construct __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//common middlewares
app.use(                        // middleware
    cors({
        origin: 'https://twitter-clone-xi-bay.vercel.app' , // what should be allowed and what is not allowed we will mention in .env in CORS_ORIGIN
        credentials: true               // allow credentials to be passed
    })                             // one more middleware as cors
)

app.use(express.json({       //middleware to receive json type of data from request
    limit: "16kb"
}))
// we are writing it as middleware because for any request client can ask for any type of data.
app.use(express.urlencoded({ extended: true }))                  // accepting urlencoded type of data
//
//app.use(express.static(path.join(__dirname, './public')));
app.use(cookieParser())            //serve assets like images or css to keep any images in public
app.use("/WeatherApp/uploads", express.static(path.join(__dirname, "../uploads")));
// this middleware sets res.locals.user as current user role  and for every request this runs so wherever we go we will be having an idea who logged in and what content to print on html page 
// eg: when we login we send isauthenticated information to ejs file by keeping in res.locals so we can check condition and print log out button or login button accordingly
app.use((req, res, next) => {
    const reqUrl = req.originalUrl;console.log(reqUrl)
        if (reqUrl == '/favicon.ico') {
        return res.status(204).end();
    }
    else {
        const token = req.cookies.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
                res.locals.isAuthenticated = true;
                res.locals.user = decoded; // Pass user info to views
            } catch (err) {
                res.locals.isAuthenticated = false;
                return res.redirect('/WeatherApp/loginPage')
            }
        }
        else {

            if (reqUrl == '/WeatherApp/register' || reqUrl == '/WeatherApp/registerPage' || reqUrl == '/WeatherApp/' || reqUrl == '/WeatherApp/loginPage' || reqUrl == '/WeatherApp/login' || reqUrl == '/WeatherApp/currentuser') {
                res.locals.isAuthenticated = false;
            }
            else {
                res.locals.isAuthenticated = false;
                return res.redirect('/WeatherApp/');
            }
        }
        console.log('isAuthenticated:', res.locals.isAuthenticated);
        next(); // Proceed to the next middleware or route handler
    }
});



// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');           //setting up view engine


// Refresh cache every 10 minutes
setInterval(refreshCache, 10 * 60 * 1000);


//import routes

import { router } from "./routes/user.routes.js";




//routes

app.use("/WeatherApp", router);
//app.use(errorHandler)
export { app };
