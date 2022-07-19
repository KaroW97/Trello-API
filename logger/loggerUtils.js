const { stringify } = require('../utils/common')
const { logger } = require('./logger')
const cache = require('memory-cache')

const generateMessage = async (type, message) => {
  const isCard = await cache.get('CARD')

  console.log(isCard);
  const ifCard = isCard ? 'CARD' : ''

  const chooseMassage = !type.includes('ERROR')
    ? `Successful ${type} ${ifCard} item: ${stringify(message)}`
    : `Problem occurred during ${ifCard} FETCH: ${message}`
  cache.del('CARD')
  return {
    [type]: chooseMassage,
    FETCH_BY_ID: `Successfully FETCHED ${ifCard} item with ${isCard ? 'board' : ''
      } id: ${stringify(message)}`,
    FETCH: `Successfully FETCHED all ${ifCard} items ${isCard ? `for id ${message}` : ''
      }`
  }
}

const success = async (type, message) => {
  const checkType = (await cache.get('CARD')) ? 'CARD_' + type : type
  logger.info({
    type: checkType,
    message: (await generateMessage(type, message))[type]
  })
}

const error = async (type, message) =>
  logger.error({ type, message: (await generateMessage(type, message))[type] })

module.exports = {
  success,
  error
}
