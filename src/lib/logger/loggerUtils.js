const { stringify } = require('../utils/common')
const { logger } = require('./logger')
const cache = require('memory-cache')

/**
 * Message sentences
 * @param {boolean} card
 * @param {string} type
 * @param {Record<string, string> | string} message
 * @returns { Record<string, string>}
 */
const fillSentence = (card, type, message) => ({
  cardOrBoard: card ? 'item with board id' : 'item with id',
  ifCard: card ? 'card' : '',
  replace: type.includes('ERROR') ? type.replace('ERROR_', '') : '',
  ifCardAddId: card ? `for id ${message}` : ''
})

/**
 * Create logger message
 * @param {string} type
 * @param {Record<string, string> | string} message
 * @returns {Promise<Record<string, string>>}
 */
const logMessage = async (type, message) => {
  // Check if card is in cache
  const card = await cache.get('CARD')

  // Get proper messages
  const { ifCard, cardOrBoard, replace, ifCardAddId } = fillSentence(
    card,
    type,
    message
  )

  // Choose if error or success
  const chooseMassage = !type.includes('ERROR')
    ? `Successful ${type} ${cardOrBoard} :${stringify(message)} `
    : `Problem occurred during ${ifCard} ${replace}: ${message}`

  // When token check don't delete CARD value from cache
  if (type !== 'TOKEN_CHECK') cache.del('CARD')

  return {
    [type]: chooseMassage,
    FETCH: `Successful ${type} all ${ifCard} items ${ifCardAddId}`,
    TOKEN_CHECK: 'Access granted to ADMIN',
    TOKEN_CHECK_ERROR: 'Access denied'
  }
}

/**
 * Create logger structure
 * @param {string} type
 * @param {Record<string, string> | string} message
 * @returns { Promise<Record<string, string>>}
 */
const createStructure = async (type, message) => ({
  type: (await cache.get('CARD')) ? 'CARD_' + type : type,
  message: (await logMessage(type, message))[type]
})

/**
 * Success logger
 * @param {Record<string, string>} param0
 * @returns {Promise<winston.Logger>}
 */
const success = async ({ type, message }) => {
  logger.log('info', await createStructure(type, message))
}

/**
 * Error logger
 * @param {Record<string, string>} type
 * @param {Error} param1
 * @returns {Promise<winston.Logger>}
 */
const error = async (type, { message, name }) =>
  logger.log('error', { ...(await createStructure(type, message)), name })

module.exports = {
  success,
  error
}
