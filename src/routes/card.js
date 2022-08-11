const express = require('express')
const router = express.Router()
const { card } = require('../service/index')
const { logger, variable, joi, common, authorize } = require('../lib/index')
const cache = require('memory-cache')

const loggerTypes = variable.LOGGER_TYPES
/**
 * Get all cards
 */
router.get('/:boardId', async (req, res) => {
  try {
    // Add value to cache
    cache.put('CARD', true)

    const { boardId } = req.params

    // Get all cards
    const cards = await card.getAllCards(boardId)

    // Create message
    const message = common.successMessage(loggerTypes.FETCH, boardId, cards)

    // Log message
    logger.success(message.data)

    // Return message
    res.status(200).json(message)
  } catch (err) {
    // Log error
    logger.error(loggerTypes.ERROR_FETCH, err)

    // Return error message
    res.status(400).json(common.errorMessage(err))

    throw err
  }
})

/**
 * Get one card
 */
router.get('/:boardId/:cardId', async (req, res) => {
  try {
    // Add value to cache
    cache.put('CARD', true)

    const { boardId, cardId } = req.params

    // Get one card by id
    const cardItem = await card.getCardItem(boardId, cardId)

    // Create message
    const message = common.successMessage(
      loggerTypes.FETCH_BY_ID,
      boardId,
      cardItem
    )

    // Log message
    logger.success(message.data)

    // Return message
    res.send(message)
  } catch (err) {
    // Log error
    logger.error(loggerTypes.ERROR_FETCH_BY_ID, err)

    // Return error message
    res.status(400).json(common.errorMessage(err))

    throw err
  }
})

/**
 * Delete card
 */
router.delete('/:boardId/:cardId', authorize, async (req, res) => {
  try {
    // Add value to cache
    cache.put('CARD', true)

    const { boardId, cardId } = req.params

    // Delete item
    const deletedItem = await card.deleteCard(boardId, cardId)

    // Create message
    const message = common.successMessage(
      loggerTypes.DELETE,
      boardId,
      deletedItem
    )

    // Log message
    logger.success(message.data)

    // Return message
    res.status(200).json(message)
  } catch (err) {
    // Log error
    logger.error(loggerTypes.ERROR_DELETE, err)

    // Return error message
    res.status(400).json(common.errorMessage(err))

    throw err
  }
})

/**
 * Create new card
 */
router.post('/:boardId', authorize, async (req, res) => {
  try {
    // Add value to cache
    cache.put('CARD', true)
    const { body, params } = req

    const { boardId } = params

    // Validate body
    const item = await joi.joiCreateItem(body)

    // Add new record to db
    await card.addNewCard({ boardId, ...item })

    // Create message
    const message = common.successMessage(loggerTypes.ADD, boardId, item)

    // Log message
    logger.success(message.data)

    // Return message
    res.status(200).json(message)
  } catch (err) {
    // Log error
    logger.error(loggerTypes.ERROR_ADD, err)

    // Return error message
    res.status(400).json(common.errorMessage(err))

    throw err
  }
})

/**
 * Update card
 */
router.put('/:boardId/:id', authorize, async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId, id } = req.params

    // Joi validation
    const item = await joi.joiUpdateItem({ id, ...req.body })

    // Update element
    await card.updateCard({ boardId, id, ...req.body })

    // Create message
    const message = common.successMessage(loggerTypes.UPDATE, boardId, item)

    // Log message
    logger.success(message.data)

    // Return response
    res.status(200).json(message)
  } catch (err) {
    // Log error
    logger.error(loggerTypes.ERROR_UPDATE, err)

    // Return error message
    res.status(400).json(common.errorMessage(err))

    throw err
  }
})

module.exports = router
