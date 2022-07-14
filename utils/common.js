const { v4: uuid } = require('uuid')
const fs = require('fs')

const BACKUP_DB = './localDB/boardBackup.json'
const BOARD_DB = './localDB/board.json'

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
  ...body
})

module.exports = {
  checkIfExists,
  stringify,
  createBackup,
  deleteBackup,
  restoreBackup,
  BOARD_DB,
  createBoard
}
