const express = require('express')
const router = express.Router()
const { card } = require('../components/index')
const { logger, variable, joi, backupUtils, common, authorize } = require('../lib/index')
const cache = require('memory-cache')

const loggerTypes = variable.LOGGER_TYPES
/**
 * Get all cards
 */
router.get('/:boardId', async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId } = req.params

    const cards = await card.getAllCards(boardId)

    const message = common.successMessage(loggerTypes.FETCH, boardId, cards)

    logger.success(message.data)

    res.status(200).json(message)
  } catch (err) {
    logger.error(loggerTypes.ERROR_FETCH, err)

    res.status(400).json(common.errorMessage(err))

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

    const message = common.successMessage(
      loggerTypes.FETCH_BY_ID,
      boardId,
      cardItem
    )

    logger.success(message.data)

    res.send(message)
  } catch (err) {
    logger.error(loggerTypes.ERROR_FETCH_BY_ID, err)

    res.status(400).json(common.errorMessage(err))

    throw err
  }
})

/**
 * Delete card
 */
router.delete('/:boardId/:cardId', authorize, async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId, cardId } = req.params

    const deletedItem = await card.deleteCard(boardId, cardId)

    const message = common.successMessage(
      loggerTypes.DELETE,
      boardId,
      deletedItem
    )

    logger.success(message.data)

    res.status(200).json(message)
  } catch (err) {
    logger.error(loggerTypes.ERROR_DELETE, err)

    await backupUtils.restoreBackup()

    res.status(400).json(common.errorMessage(err))

    throw err
  } finally {
    backupUtils.deleteFile()
  }
})

/**
 * Create new card
 */
router.post('/:boardId', authorize, async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId } = req.params

    const { body } = req

    const item = await joi.joiCreateItem(body)

    await card.addNewCard({ boardId, ...item })

    const message = common.successMessage(loggerTypes.ADD, boardId, item)

    logger.success(message.data)

    res.status(200).json(message)
  } catch (err) {
    logger.error(loggerTypes.ERROR_ADD, err)

    await backupUtils.restoreBackup()

    res.status(400).json(common.errorMessage(err))

    throw err
  } finally {
    backupUtils.deleteFile()
  }
})

/**
 * Update card
 */
router.put('/:boardId/:id', authorize, async (req, res) => {
  try {
    cache.put('CARD', true)

    const { boardId, id } = req.params

    const item = await joi.joiUpdateItem({ id, ...req.body })

    await card.updateCard({ boardId, id, ...req.body })

    const message = common.successMessage(loggerTypes.UPDATE, boardId, item)

    logger.success(message.data)

    res.status(200).json(message)
  } catch (err) {
    logger.error(loggerTypes.ERROR_UPDATE, err)

    await backupUtils.restoreBackup()

    res.status(400).json(common.errorMessage(err))

    throw err
  } finally {
    backupUtils.deleteFile()
  }
})

module.exports = router
