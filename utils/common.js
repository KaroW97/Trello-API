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
const checkIfExists = async (fileName = BOARD_DB) => {
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
  deleteFile(BOARD_DB)

  fs.promises.rename(BACKUP_DB, BOARD_DB)
}

/**
 * Delete backup database
 */
const deleteFile = (fileName = BACKUP_DB) => {
  setInterval(async () => {
    const ifExists = await checkIfExists(fileName)

    if (ifExists) {
      fs.promises.unlink(fileName)
      clearInterval(100)
    }
  }, 100)
}

const createBoard = (body) => ({
  id: uuid(),
  createAt: new Date(),
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

const checkIfEmpty = async () => {
  const ifExists = await checkIfExists(BOARD_DB)

  if (ifExists) {
    const { size } = await fs.promises.stat(BOARD_DB)

    if (size === 0) return true
    return false
  }

  return true
}

const validateFile = async () => {
  const ifExists = await checkIfExists(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  if (!(await fs.promises.stat(BOARD_DB)).size) throw new Error('File is empty')
}

const streamHandler = (fileName) => {
  const writeStream = fs.createWriteStream(fileName)

  const readStream = fs.createReadStream(fileName)

  createBackup(readStream)

  return {
    writeStream,
    readStream
  }
}
module.exports = {
  checkIfExists,
  stringify,
  createBackup,
  deleteFile,
  restoreBackup,
  createBoard,
  randomCardArray,
  validateFile,
  streamHandler,
  checkIfEmpty,
  BOARD_DB,
  LOGGER_TYPES
}
