const { joiCreateItem, joiUpdateItem } = require('../joiModels/board')
const { board } = require('../components/index')
const express = require('express')
const {
  deleteFile,
  restoreBackup,
  randomCardArray,
  LOGGER_TYPES
} = require('../utils/common')
const logger = require('../logger/loggerUtils')
const router = express.Router()

//TODO: Add diferenciation to type of users:
// console.log(req.headers['x-access-token']);
//TODO: Check if object contains only brackets if so dont add comma at the end of new record

/**
 * Get all boards
 */
router.get('/', async (req, res) => {
  try {
    res.setHeader('Transfer-Encoding', 'chunked')

    await board.getAll(res)

    logger.success(LOGGER_TYPES.FETCH)
  } catch (err) {
    const { message } = err

    res.removeHeader('Transfer-Encoding')

    logger.error(LOGGER_TYPES.ERROR_FETCH, message)

    res.status(400).json({ err: message })

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

    logger.success(LOGGER_TYPES.FETCH_BY_ID, id)

    res.status(200).json(item)
  } catch (err) {
    const { message } = err

    logger.error(LOGGER_TYPES.ERROR_FETCH_BY_ID, message)

    res.status(400).json({ err: message })

    throw err
  }
})

/**
 * Delete board
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const deletedItem = await board.deleteRecord(id)

    logger.success(LOGGER_TYPES.DELETE, deletedItem)

    res.status(200).json(deletedItem)
  } catch (err) {
    const { message } = err

    logger.error(LOGGER_TYPES.ERROR_DELETE, message)

    await restoreBackup()

    res.status(400).json({ err: message })

    throw err
  } finally {
    deleteFile()
  }
})

/**
 * update board
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const joiBody = joiUpdateItem({ id, ...req.body })

    await board.updateRecord({ id, ...req.body })

    logger.success(LOGGER_TYPES.UPDATE, joiBody)

    res.status(200).json(joiBody)
  } catch (err) {
    const { message } = err

    logger.error(LOGGER_TYPES.ERROR_UPDATE, message)

    await restoreBackup()

    res.status(400).json({ err: message })

    throw err
  } finally {
    deleteFile()
  }
})

/**
 * Add new  board
 */
router.post('/', async (req, res) => {
  try {
    const { body } = req

    const cards = randomCardArray()

    const joiBody = joiCreateItem({ ...body, cards: cards })

    await board.addNewRecord(joiBody)

    logger.success(LOGGER_TYPES.ADD, joiBody)

    res.status(200).json(joiBody)
  } catch (err) {
    const { message } = err

    logger.error(LOGGER_TYPES.ERROR_ADD, message)

    await restoreBackup()

    res.status(400).json({ err: message })

    throw err
  } finally {
    await deleteFile()
  }
})

module.exports = router
