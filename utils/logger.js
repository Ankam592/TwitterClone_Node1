import {createLogger,format,transports} from 'winston'
const {combine,timestamp,json,colorize} = format


//To create a customized Logger ->createLogger
//To format the logger  created 
//log the transport data from One endpoint to other 

const consoleLogFormat = format.combine(
    format.colorize(),
    format.printf(({
        level,message,timestamp }) =>
        {
            return `${level}:${message}`
        }
    )
)

//we are creating a standardized format for all the logs which are printing in this application.
//LOG PROPERTIES 1)LEVEL 2)MESSAGE 3)TIMESTAMP  can print these as customized



const Logger = createLogger({
    level : 'info',
    format :  combine(
        colorize(),timestamp(),json()
    ),
    transports:                     // //How I want to use this transported information like just console log or put ot into file or put in data base also using a plugin : winston.mongodb
    [
        new transports.Console({              // Console logging format   
            format:consoleLogFormat
        }),
        new transports.File({filename:'mani/app.log'}) // console logging sending into file
    ],
})

export {Logger};  // export the logger created        ''we have configured the logger in our own way