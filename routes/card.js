const express = require('express')
const router = express.Router()
const { joiUpdateItem, joiCreateItem } = require('../joiModels/joiValidation')
const {
  restoreBackup,
  deleteFile,
  LOGGER_TYPES,
  errorMessage
} = require('../utils/common')
const { card } = require('../components/index')
const logger = require('../logger/loggerUtils')
const cache = require('memory-cache')

/**
 * Get all cards
 */
router.get('/:boardId', async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId } = req.params

    const cards = await card.getAllCards(res, boardId)

    logger.success(LOGGER_TYPES.FETCH, boardId)

    res.status(200).json(cards)
  } catch (err) {
    logger.error(LOGGER_TYPES.ERROR_FETCH, err)

    res.status(400).json(errorMessage(err))

    throw err
  }
})

/**
 * Get one card
 */
router.get('/:boardId/:cardId', async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId, cardId } = req.params

    const cardItem = await card.getCardItem(boardId, cardId)

    logger.success(LOGGER_TYPES.FETCH_BY_ID, boardId)

    res.send(cardItem)
  } catch (err) {
    logger.error(LOGGER_TYPES.ERROR_FETCH_BY_ID, err)

    res.status(400).json(errorMessage(err))

    throw err
  }
})

/**
 * Delete card
 */
router.delete('/:boardId/:cardId', async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId, cardId } = req.params

    const deletedItem = await card.deleteCard(boardId, cardId)

    logger.success(LOGGER_TYPES.DELETE, deletedItem)

    res.status(200).json(deletedItem)
  } catch (err) {
    logger.error(LOGGER_TYPES.ERROR_DELETE, err)

    await restoreBackup()

    res.status(400).json(errorMessage(err))

    throw err
  } finally {
    deleteFile()
  }
})

/**
 * Create new card
 */
router.post('/:boardId', async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId } = req.params

    const { body } = req

    const joiBody = await joiCreateItem(body)

    await card.addNewCard({ boardId, ...joiBody })

    logger.success(LOGGER_TYPES.ADD, joiBody)

    res.status(200).json(joiBody)
  } catch (err) {
    logger.error(LOGGER_TYPES.ERROR_ADD, err)

    await restoreBackup()

    res.status(400).json(errorMessage(err))

    throw err
  } finally {
    deleteFile()
  }
})

/**
 * Update card
 */
router.put('/:boardId/:id', async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId, id } = req.params

    const joiBody = joiUpdateItem({ id, ...req.body })

    await card.updateCard({ boardId, id, ...req.body })

    logger.success(LOGGER_TYPES.UPDATE, joiBody)

    res.status(200).json(joiBody)
  } catch (err) {
    logger.error(LOGGER_TYPES.ERROR_UPDATE, err)

    await restoreBackup()

    res.status(400).json(errorMessage(err))

    throw err
  } finally {
    deleteFile()
  }
})

module.exports = router
