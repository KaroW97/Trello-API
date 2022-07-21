const { stringify } = require('../utils/common')
const { logger } = require('./logger')
const cache = require('memory-cache')

const logMessage = async (type, message) => {
  const card = await cache.get('CARD')

  const errorType = type.replace('ERROR_', '')

  cache.del('CARD')

  const cardOrBoardMessage = card ? 'item with board id' : 'item with id'

  const chooseMassage = !type.includes('ERROR')
    ? `Successful ${type} ${cardOrBoardMessage} :${stringify(message)} `
    : `Problem occurred during ${card ? card : ''} ${errorType}: ${message}`

  return {
    [type]: chooseMassage,
    FETCH: `Successful ${type} all ${card} items ${
      card ? `for id ${message}` : ''
    }`
  }
}

const createLogInfo = async (type, message) => ({
  type: (await cache.get('CARD')) ? 'CARD_' + type : type,
  message: (await logMessage(type, message))[type]
})

const success = async (type, message) =>
  logger.info(await createLogInfo(type, message))

const error = async (type, { message, name }) =>
  logger.error({ ...(await createLogInfo(type, message)), name })

module.exports = {
  success,
  error
}
