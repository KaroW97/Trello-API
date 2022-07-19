const { v4: uuid } = require('uuid')
const Chance = require('chance')
const chance = new Chance()
const fs = require('fs')

const BACKUP_DB = './localDB/boardBackup.json'
const BOARD_DB = './localDB/board.json'

const LOGGER_TYPES = {
  FETCH: 'FETCH',
  FETCH_BY_ID: 'FETCH_BY_ID',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  ERROR_FETCH: 'ERROR_FETCH',
  ERROR_FETCH_BY_ID: 'ERROR_FETCH_BY_ID',
  ERROR_DELETE: 'ERROR_DELETE',
  ERROR_UPDATE: 'ERROR_UPDATE',
  ERROR_ADD: 'ERROR_ADD'
}

/**
 * Checks if file already exists
 * @param {string} fileName
 * @returns {boolean}
 */
const checkIfExists = async (fileName) => {
  try {
    await fs.promises.access(fileName)
    return true
  } catch (err) {
    return false
  }
}

/**
 * Stringify object
 * @param {Record<string, unknown> || Record<string, unknown>[]} data
 * @returns
 */
const stringify = (data) => JSON.stringify(data, null, 2)

/**
 * Create Backup database
 * @param {Stream} data
 */
const createBackup = (data) => {
  const writeStream = fs.createWriteStream(BACKUP_DB)

  data.pipe(writeStream)
}

/**
 * Change backup database name to regular one and delete broken data
 */
const restoreBackup = async () => {
  deleteBackup(BOARD_DB)
  fs.promises.rename(BACKUP_DB, BOARD_DB)
}

/**
 * Delete backup database
 */
const deleteBackup = () => {
  setInterval(() => {
    const isExists = checkIfExists(BACKUP_DB)

    if (isExists) {
      fs.promises.unlink(BACKUP_DB)
      clearInterval(100)
    }
  }, 100)
}

const createBoard = (body) => ({
  id: uuid(),
  createAt: new Date,
  ...body
})

const createRandomCard = () => ({
  id: uuid(),
  name: chance.name(),
  description: chance.string(),
  createAt: chance.date(),
  estimate: chance.date(),
  status: chance.integer({ min: -20, max: 20 }),
  dueDate: chance.date(),
  labels: [chance.string()]
})

const randomCardArray = () => {
  let randomArray = []
  for (let i = 0; i < 3; i++) {
    randomArray.push(createRandomCard())
  }
  return randomArray
}

module.exports = {
  checkIfExists,
  stringify,
  createBackup,
  deleteBackup,
  restoreBackup,
  BOARD_DB,
  createBoard,
  randomCardArray,
  LOGGER_TYPES
}
