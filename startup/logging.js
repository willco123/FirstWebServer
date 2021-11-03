const winston = require('winston');
const {format} = winston
const path = require('path')

//Use process.on for global exception handling
//This module should be ran once on startup, if I have to require it in other place then gotta change some stuff
//Module currently executes once, and adds logger instance to winston, no export required
const logFormat = format.printf(info =>
  `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
);
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  format: format.combine(
  format.label({ label: path.basename(process.mainModule.filename) }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),

  ),

  transports: [
    new winston.transports.File({
      //handleExceptions: false,
      filename: 'logs/error.log',
      level: 'error',
      format: format.combine(
        format.errors({ stack: false }),
        format.json()
      )
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'debug',
      format: format.combine(
        format.json(),
      )
    }),
    new winston.transports.Console({
      //handleExceptions: true,//seems to effect both log files & console
      format: format.combine(
        format.colorize(),
        format.splat(),//Useful for logging JSON objects
        logFormat
      )
    }),
  ],
  //exitOnError: false
});


// if (process.env.NODE_ENV !== 'production') {
//       logger.add(new winston.transports.Console({
//         //format: winston.format.simple(),
//         logFormat,
//         handleExceptions: true
//     }));
//   }

winston.add(logger)//Add to the logger, dont need to export the logger above now
//Winston seems to add the logger anyway, so stuff will be logged twice in this file

// module.exports = {
//   logger
// }





///////////TO DO////////////
//Exceptions still be written to file, dont want that
//Still don't understand how the stack trace is being manipulated by Winston
