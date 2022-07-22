const { board } = require('../components/index')
const express = require('express')
const {
  logger,
  variable,
  joi,
  backupUtils,
  common,
  authorize
} = require('../lib/index')
const router = express.Router()
const loggerTypes = variable.LOGGER_TYPES

/**
 * Get all boards
 */
router.get('/', async (req, res) => {
  try {
    // Set header to enable chunk transfer
    res.setHeader('Transfer-Encoding', 'chunked')

    // Return all elements in db
    await board.getAll(res)

    // Create message for logger
    const message = common.successMessage(loggerTypes.FETCH)

    // Log success message
    logger.success(message.data)
  } catch (err) {
    // Remove transfer header to prevent error
    res.removeHeader('Transfer-Encoding')

    // Log error
    logger.error(loggerTypes.ERROR_FETCH, err)

    // Return error message
    res.status(400).json(common.errorMessage(err))

    throw err
  }
})

/**
 * Get one board
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Get item
    const item = await board.getBoardItem(id)

    // Create message
    const message = common.successMessage(loggerTypes.FETCH_BY_ID, id, item)

    // Log message
    logger.success(message.data)

    // Return message
    res.status(200).json(message)
  } catch (err) {
    logger.error(loggerTypes.ERROR_FETCH_BY_ID, err)

    res.status(400).json(common.errorMessage(err))

    throw err
  }
})

/**
 * Delete board
 */
router.delete('/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params

    // Delete item
    const item = await board.deleteRecord(id)

    // Create message
    const message = common.successMessage(loggerTypes.DELETE, id, item)

    // Log message
    logger.success(message.data)

    // Return message
    res.status(200).json(message)
  } catch (err) {
    // Log error
    logger.error(loggerTypes.ERROR_DELETE, err)

    // Delete old db and chance name of backup db
    await backupUtils.restoreBackup()

    // Return error message
    res.status(400).json(common.errorMessage(err))

    throw err
  } finally {
    // Delete backup file
    backupUtils.deleteFile()
  }
})

/**
 * update board
 */
router.put('/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params

    // Joi validation
    const item = await joi.joiUpdateItem({ id, ...req.body })

    // Update element
    await board.updateRecord({ id, ...req.body })

    // Create message
    const message = common.successMessage(loggerTypes.UPDATE, id, item)

    // Log message
    logger.success(message.data)

    // Return response
    res.status(200).json(message)
  } catch (err) {
    // Log error
    logger.error(loggerTypes.ERROR_UPDATE, err)
    console.log('jestem')
    // Delete old db and chance name of backup db
    await backupUtils.restoreBackup()

    // Return error message
    res.status(400).json(common.errorMessage(err))

    throw err
  } finally {
    // Delete backup file
    backupUtils.deleteFile()
  }
})

/**
 * Add new  board
 */
router.post('/', authorize, async (req, res) => {
  try {
    const { body } = req

    // Create random cards
    const cards = common.randomCardArray()

    // Validate body
    const item = await joi.joiCreateItem({ ...body, cards: cards })

    // Add new record to db
    await board.addNewRecord(item)

    // Create message
    const message = common.successMessage(loggerTypes.ADD, item.id, item)

    // Log message
    logger.success(message.data)

    // Return message
    res.status(200).json(message)
  } catch (err) {
    // Log error
    logger.error(loggerTypes.ERROR_ADD, err)

    // Delete old db and chance name of backup db
    await backupUtils.restoreBackup()

    // Return error message
    res.status(400).json(common.errorMessage(err))

    throw err
  } finally {
    // Delete backup file
    backupUtils.deleteFile()
  }
})

module.exports = router
