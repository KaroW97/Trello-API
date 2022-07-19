require('dotenv').config()
const { createLogger, format, transports } = require('winston')

const env = process.env.NODE_ENV || 'development'

const logger = createLogger({
  format: format.combine(format.colorize(), format.json())
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
