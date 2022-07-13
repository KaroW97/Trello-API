const { joiCreateItem, joiUpdateItem } = require('../model/board')
const { Chance } = require('chance')
const express = require('express')
const { stringify, deleteBackup, restoreBackup } = require('../utils/common')

const { addNewRecord, updateRecord } = require('../utils/boardHelpers')
const { logger } = require('../utils/logger')

const router = express.Router()
const chance = new Chance()

/**
 * Get all boards
 */
router.get('/', (req, res) => {
  console.log(req.body)
  res.send('Board')
})

/**
 * Get one board
 */
router.get('/:id', (req, res) => {
  res.send('Board')
})

/**
 * Delete board
 */
router.delete('/:id', (req, res) => {
  res.send('Board')
})

/**
 * update board
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const joiBody = joiUpdateItem({ id, ...req.body })

    await updateRecord({ id, ...req.body })

    logger.info(`Successfully save of ${stringify(joiBody)}`)

    res.status(200).json(joiBody)
  } catch (err) {
    logger.error(`Error: ${err}`)

    await restoreBackup()

    res.status(400).json(err)

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
    logger.error(`Error: ${err}`)

    await restoreBackup()

    res.status(400).json(err)

    throw err
  } finally {
    await deleteBackup()
  }
})

module.exports = router
