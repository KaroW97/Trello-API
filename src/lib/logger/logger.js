const { createLogger, format, transports } = require('winston')
require('dotenv').config()

const env = process.env.NODE_ENV || 'development'

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A'
    }),
    format.json(),
    format.align()
  )
})

// If production print in accurate files
if (env === 'production') {
  // All logs
  logger.add(
    new transports.File({
      filename: 'loggerOutput/combined.log'
    })
  )

  // Error logs
  logger.add(
    new transports.File({
      filename: 'loggerOutput/error.log',
      level: 'error'
    })
  )
}

// If env is not production log in console
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
