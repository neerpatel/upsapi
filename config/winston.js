const appRoot = require("app-root-path");

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});


const options = {
  file: {
    level: "info",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true
  },
  DailyRotateFile: {
    name: "file",
    datePattern: ".yyyy-MM-ddTHH",
    filename: `${appRoot}/logs/app.log`
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
    format: myFormat
  }
};

const logger = new createLogger({
    format: combine(
      timestamp(),
      myFormat
    ),
    transports: [
      new transports.File(options.file),
      new transports.Console(options.console)
    ],
    exitOnError: false // do not exit on handled exceptions
  });
  
  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    }
  };
  
  module.exports = logger;