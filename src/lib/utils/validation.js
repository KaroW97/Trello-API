const { FileError, FileErrorEmpty } = require('./errors')
const { BOARD_DB } = require('./variables')
const fs = require('fs')

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

const checkIfEmpty = async () => {
  const ifExists = await checkIfExists(BOARD_DB)

  if (ifExists) {
    const { size } = await fs.promises.stat(BOARD_DB)

    if (size === 0) return true
    return false
  }

  return true
}

const validateFile = async (filePath = BOARD_DB) => {
  const ifExists = await checkIfExists(filePath)

  if (!ifExists) throw new FileError(filePath)

  if (!(await fs.promises.stat(filePath)).size)
    throw new FileErrorEmpty(filePath)
}

module.exports = {
  validateFile,
  checkIfEmpty,
  checkIfExists
}
