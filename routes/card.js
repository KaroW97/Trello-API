const express = require('express')
const router = express.Router()
const { joiUpdateItem, joiCreateItem } = require('../joiModels/card')
const { restoreBackup, deleteBackup, LOGGER_TYPES } = require('../utils/common')
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

    await card.getAllCards(res, boardId)

    logger.success(LOGGER_TYPES.FETCH, boardId)
  } catch (err) {
    const { message } = err

    logger.error(LOGGER_TYPES.ERROR_FETCH, message)

    res.status(400).json({ err: message })

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
    const { message } = err

    logger.error(LOGGER_TYPES.ERROR_FETCH_BY_ID, message)

    res.status(400).json({ err: err.message })

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
    const { message } = err

    logger.error(LOGGER_TYPES.ERROR_DELETE, message)

    await restoreBackup()

    res.status(400).json({ err: err.message })

    throw err
  } finally {
    deleteBackup()
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

    const joiBody = joiCreateItem(body)

    await card.addNewCard({ boardId, ...joiBody })

    logger.success(LOGGER_TYPES.ADD, joiBody)

    res.status(200).json(joiBody)
  } catch (err) {
    const { message } = err

    logger.error(LOGGER_TYPES.ERROR_ADD, message)

    await restoreBackup()

    res.status(400).json({ err: err.message })

    throw err
  } finally {
    deleteBackup()
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
    const { message } = err

    logger.error(LOGGER_TYPES.ERROR_UPDATE, message)

    await restoreBackup()

    res.status(400).json({ err: err.message })

    throw err
  } finally {
    deleteBackup()
  }
})

/* router.use((req, res, next) => {
  res.status(404);

  logger.error(`404: Page not found`)

  if (req.accepts('html')) {
    res.send({ err: '404: Page not found' });
    return;
  }

  res.send('Not found');
}) */

module.exports = router
