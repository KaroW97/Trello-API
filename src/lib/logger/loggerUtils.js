const { stringify } = require('../utils/common')
const { logger } = require('./logger')
const cache = require('memory-cache')

const fillSentence = (card, type, message) => ({
  cardOrBoard: card ? 'item with board id' : 'item with id',
  ifCard: card ? 'card' : '',
  replace: type.includes('ERROR') ? type.replace('ERROR_', '') : '',
  ifCardAddId: card ? `for id ${message}` : ''
})

const logMessage = async (type, message) => {
  const card = await cache.get('CARD')

  const { ifCard, cardOrBoard, replace, ifCardAddId } = fillSentence(
    card,
    type,
    message
  )

  const chooseMassage = !type.includes('ERROR')
    ? `Successful ${type} ${cardOrBoard} :${stringify(message)} `
    : `Problem occurred during ${ifCard} ${replace}: ${message}`

  cache.del('CARD')

  return {
    [type]: chooseMassage,
    FETCH: `Successful ${type} all ${ifCard} items ${ifCardAddId}`,
    TOKEN_CHECK: `Access granted to ADMIN`,
    TOKEN_CHECK_ERROR: `Access denied`,
  }
}

const createLogInfo = async (type, message) => ({
  type: (await cache.get('CARD')) ? 'CARD_' + type : type,
  message: (await logMessage(type, message))[type]
})

const success = async ({ type, message }) =>
  logger.info(await createLogInfo(type, message))

const error = async (type, { message, name }) =>
  logger.error({ ...(await createLogInfo(type, message)), name })

module.exports = {
  success,
  error
}
