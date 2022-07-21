const { errorMessage, successMessage } = require('../utils/common')
const { TOKEN_CHECK, TOKEN_CHECK_ERROR } = require('../utils/variables').LOGGER_TYPES
const logger = require('../logger/loggerUtils')

const token = require('./token.json')
const { AccessDenied } = require('../utils/errors')

exports.authorize = (req, res, next) => {
  const header = req.header('x-access-token')
  try {
    if (header === token.ADMIN_TOKEN) {
      const message = successMessage(TOKEN_CHECK)

      logger.success(message.data)

      return next()
    }

    throw new AccessDenied()
  } catch (err) {
    logger.error(TOKEN_CHECK_ERROR, err)

    res.status(400).json(errorMessage(err))

    throw err
  }
}