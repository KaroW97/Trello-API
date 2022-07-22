const { errorMessage, successMessage } = require('../utils/common')
const { TOKEN_CHECK, TOKEN_CHECK_ERROR } =
  require('../utils/variables').LOGGER_TYPES
const logger = require('../logger/loggerUtils')

const token = require('./token.json')
const { AccessDenied } = require('../utils/errors')

/**
 * Check if user has accesses to perform action
 * @param {Request<{id: string;}, any, any, qs.ParsedQs, Record<string, any>>} req
 * @param {Response<any, Record<string, any>, number>} res
 * @param {NextFunction} next
 * @returns {NextFunction | Error}
 */
exports.authorize = (req, res, next) => {
  const header = req.header('x-access-token')

  try {
    // If header provided from request is the same as expected toke
    // Grant accesses
    if (header === token.ADMIN_TOKEN) {
      const message = successMessage(TOKEN_CHECK)

      logger.success(message.data)

      return next()
    }

    // Else throw access denied error
    throw new AccessDenied()
  } catch (err) {
    // Log error
    logger.error(TOKEN_CHECK_ERROR, err)

    // Return error
    res.status(400).json(errorMessage(err))

    throw err
  }
}
