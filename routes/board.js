const { joiCreateItem, joiUpdateItem } = require('../joiModels/joiValidation')
const { board } = require('../components/index')
const express = require('express')
const {
  deleteFile,
  restoreBackup,
  randomCardArray,
  LOGGER_TYPES,
  errorMessage
} = require('../utils/common')
const logger = require('../logger/loggerUtils')
const router = express.Router()

//TODO: Add diferenciation to type of users:
// console.log(req.headers['x-access-token']);

/**
 * Get all boards
 */
router.get('/', async (req, res) => {
  try {
    res.setHeader('Transfer-Encoding', 'chunked')

    await board.getAll(res)

    logger.success(LOGGER_TYPES.FETCH)
  } catch (err) {
    res.removeHeader('Transfer-Encoding')

    logger.error(LOGGER_TYPES.ERROR_FETCH, err)

    res.status(400).json(errorMessage(err))

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
    logger.error(LOGGER_TYPES.ERROR_FETCH_BY_ID, err)

    res.status(400).json(errorMessage(err))

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
    logger.error(LOGGER_TYPES.ERROR_DELETE, err)

    await restoreBackup()

    res.status(400).json(errorMessage(err))

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
    logger.error(LOGGER_TYPES.ERROR_UPDATE, err)

    await restoreBackup()

    res.status(400).json(errorMessage(err))

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

    const joiBody = await joiCreateItem({ ...body, cards: cards })

    await board.addNewRecord(joiBody)

    logger.success(LOGGER_TYPES.ADD, joiBody)

    res.status(200).json(joiBody)
  } catch (err) {
    logger.error(LOGGER_TYPES.ERROR_ADD, err)

    await restoreBackup()

    res.status(400).json(errorMessage(err))

    throw err
  } finally {
    await deleteFile()
  }
})

module.exports = router
