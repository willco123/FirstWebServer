const winston = require('winston');
const {format} = winston
const path = require('path')


// const prettyJson = format.printf(info => {
//   if (info.message.constructor === Object) {
//     info.message = JSON.stringify(info.message, null, 4)
//   }
//   return `${info.level}: ${info.message}`
// })

const logFormat = format.printf(info =>
  `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
);
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  format: format.combine(
  format.label({ label: path.basename(require.main.filename) }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({stack: true}),



  ),

  transports: [
    new winston.transports.File({
      handleExceptions: false,
      filename: '../logs/error.log',
      level: 'error',
      format: format.combine(
        format.errors({ stack: false }),
        format.json()
      )
    }),
    new winston.transports.File({
      filename: '../logs/combined.log',
      level: 'debug',
      format: format.combine(
        format.json(),
      )
    }),
    new winston.transports.Console({
      handleExceptions: true,//seems to effect both log files & console
      handleRejections: true,
      format: format.combine(
        format.colorize(),//Useful for logging JSON objects
        logFormat,

      )
    }),
  ],
  //exitOnError: false
});



console.log = function(){
  return logger.info.apply(logger, arguments)
}
console.error = function(){
  return logger.error.apply(logger, arguments)
}
console.info = function(){
  return logger.warn.apply(logger, arguments)
}
