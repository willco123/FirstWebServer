const winston = require('winston');
//Use process.on for global exception handling
//This module should be ran once on startup, if I have to require it in other place then gotta change some stuff
//Module currently executes once, and adds logger instance to winston, no export required
const logger = winston.createLogger({
  level:'info',
  format: winston.format.json(),
  defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
  ]

});


if (process.env.NODE_ENV !== 'production') {
      logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
  }

winston.add(logger)//Add to the logger, dont need to export the logger above now

// module.exports = {
//   logger
// }
