const { BACKUP_DB, BOARD_DB } = require('./variables')
const { checkIfExists } = require('./validation')
const fs = require('fs')

/**
 * Change backup database name to regular one and delete broken data
 */
const restoreBackup = async () => {
  deleteFile(BOARD_DB)

  fs.promises.rename(BACKUP_DB, BOARD_DB)
}

/**
 * Create Backup database
 * @param {Stream} data
 */
const createBackup = (data) => {
  const writeStream = fs.createWriteStream(BACKUP_DB)

  data.pipe(writeStream)
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
module.exports = {
  restoreBackup,
  createBackup,
  deleteFile
}
