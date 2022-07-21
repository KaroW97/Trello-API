const { createLogger, format, transports } = require('winston')
require('dotenv').config()

const env = process.env.NODE_ENV || 'development'

const logger = createLogger({
  level: 'info',
  format: format.json()
})

if (env === 'production') {
  logger.add(
    new transports.File({
      filename: 'loggerOutput/error.log',
      level: 'error'
    })
  )
  logger.add(new transports.File({ filename: 'loggerOutput/combined.log' }))
}
if (env !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  )
}

module.exports = {
  logger
}
