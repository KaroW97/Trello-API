const { board } = require('../components/index')
const express = require('express')
const { logger, variable, joi, backupUtils, common, authorize } = require('../lib/index')
const router = express.Router()
const loggerTypes = variable.LOGGER_TYPES

/**
 * Get all boards
 */
router.get('/', async (req, res) => {
  try {
    res.setHeader('Transfer-Encoding', 'chunked')

    await board.getAll(res)

    const message = common.successMessage(loggerTypes.FETCH)

    logger.success(message.data)
  } catch (err) {
    res.removeHeader('Transfer-Encoding')

    logger.error(loggerTypes.ERROR_FETCH, err)

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

    const item = await board.getBoardItem(id)

    const message = common.successMessage(loggerTypes.FETCH_BY_ID, id, item)

    logger.success(message.data)

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

    const item = await board.deleteRecord(id)

    const message = common.successMessage(loggerTypes.DELETE, id, item)

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
 * update board
 */
router.put('/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params

    const item = await joi.joiUpdateItem({ id, ...req.body })

    await board.updateRecord({ id, ...req.body })

    const message = common.successMessage(loggerTypes.UPDATE, id, item)

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

/**
 * Add new  board
 */
router.post('/', authorize, async (req, res) => {
  try {
    const { body } = req

    const cards = common.randomCardArray()

    const item = await joi.joiCreateItem({ ...body, cards: cards })

    await board.addNewRecord(item)

    const message = common.successMessage(loggerTypes.ADD, undefined, item)

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

module.exports = router
