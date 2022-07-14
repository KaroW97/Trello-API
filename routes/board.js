const { joiCreateItem, joiUpdateItem } = require('../model/board')
const { deleteRecord } = require('../moduls/delete')
const { updateRecord } = require('../moduls/update')
const { addNewRecord } = require('../moduls/add')
const { getBoardItem } = require('../moduls/getById')
const { logger } = require('../utils/logger')
const { getAll } = require('../moduls/getAll')
const express = require('express')
const { stringify, deleteBackup, restoreBackup } = require('../utils/common')

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

    await getAll(res)

    logger.info('Successfully fetched all items')
  } catch (err) {
    logger.error(` Error during GET ALL fetch: ${err}`)

    res.status(400).json({ err: err.message })

    throw err
  }
})

/**
 * Get one board
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const item = await getBoardItem(id)

    logger.info(`Successfully fetched item with id: ${id}`)

    res.status(200).json(item)
  } catch (err) {
    logger.error(`Error during GET BY ID fetch: ${err}`)

    res.status(400).json({ err: err.message })

    throw err
  }
})

/**
 * Delete board
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const deletedItem = await deleteRecord(id)

    logger.info(
      `Successfully deleted item with id: ${id} with ${stringify(deletedItem)}`
    )

    res.status(200).json(deletedItem)
  } catch (err) {
    logger.error(`Error during DELETE: ${err}`)

    await restoreBackup()

    res.status(400).json({ err: err.message })

    throw err
  } finally {
    deleteBackup()
  }
})

/**
 * update board
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const joiBody = joiUpdateItem({ id, ...req.body })

    await updateRecord({ id, ...req.body })

    logger.info(
      `Successfully updated item with id: ${id} with ${stringify(joiBody)}`
    )

    res.status(200).json(joiBody)
  } catch (err) {
    logger.error(`Error during UPDATE: ${err}`)

    await restoreBackup()

    res.status(400).json({ err: err.message })

    throw err
  } finally {
    deleteBackup()
  }
})

/**
 * Add new  board
 */
router.post('/', async (req, res) => {
  try {
    const { body } = req

    const joiBody = joiCreateItem(body)

    await addNewRecord(joiBody)

    logger.info(`Successfully save of ${stringify(joiBody)}`)

    res.status(200).json(joiBody)
  } catch (err) {
    logger.error(`Error during save: ${err}`)

    await restoreBackup()

    res.status(400).json({ err: err.message })

    throw err
  } finally {
    deleteBackup()
  }
})

module.exports = router
