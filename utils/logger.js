require('dotenv').config()
const winston = require('winston')

const env = process.env.NODE_ENV || 'development'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' }
})

if (env === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'loggerOutput/error.log',
      level: 'error'
    })
  )
  logger.add(
    new winston.transports.File({ filename: 'loggerOutput/combined.log' })
  )
}
if (env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

module.exports = {
  logger
}
