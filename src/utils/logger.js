import winston from 'winston';

/* 
These are the default npm logging levels
that Winston uses, but we include them explicitly
here in case you want to change them
*/
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}

// set severity based on NODE_ENV
// development: debug, i.e, log everything
// production: warn and error
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const format = winston.format.combine(

  // add a timestamp
  winston.format.timestamp(),
  // format all as json
  winston.format.json()
)

/* 
Here we output to three different destinations,
as examples of what you can do
*/
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
]

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

export default logger