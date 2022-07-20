const { stringify } = require('../utils/common')
const { logger } = require('./logger')
const cache = require('memory-cache')

const generateMessage = async (type, message) => {
  const isCard = await cache.get('CARD')

  const ifCard = isCard ? 'CARD' : ''

  const errorType = type.replace('ERROR_', '')
  cache.del('CARD')

  const chooseMassage = !type.includes('ERROR')
    ? `Successful ${type} ${ifCard} item: ${stringify(message)}`
    : `Problem occurred during ${ifCard} ${errorType} : ${message}`

  return {
    [type]: chooseMassage,
    FETCH_BY_ID: `Successfully FETCHED ${ifCard} item with ${
      isCard ? 'board' : ''
    } id: ${stringify(message)}`,
    FETCH: `Successfully FETCHED all ${ifCard} items ${
      isCard ? `for id ${message}` : ''
    }`
  }
}
const createLogInfo = async (type, message) => ({
  type: (await cache.get('CARD')) ? 'CARD_' + type : type,
  message: (await generateMessage(type, message))[type]
})

const success = async (type, message) =>
  logger.info(await createLogInfo(type, message))

const error = async (type, message) =>
  logger.error(await createLogInfo(type, message))

module.exports = {
  success,
  error
}
