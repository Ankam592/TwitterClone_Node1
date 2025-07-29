import dotenv from 'dotenv';
import {app} from "./apps.js";
import connectDB from './db/index.js';

dotenv.config()                          // configure the .env as some times they are in folders like giving path)   

const PORT = process.env.PORT 

console.log(process.env.PORT)
connectDB().then(()=>
{
    console.log('in')
    app.listen(PORT,()=>
        {   
            console.log(`Server is running on port : ${PORT}`);
            
        })
}).catch((error)=>
{
    console.error("MongoDB connection Error:\n" + error);
})
