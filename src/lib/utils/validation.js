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

/**
 * Checks if file is empty
 * @returns {Promise<boolean>}
 */
const checkIfEmpty = async (filePath = BOARD_DB) => {
  // Check if exist
  const ifExists = await checkIfExists(filePath)

  // If yes check size
  if (ifExists) {
    const { size } = await fs.promises.stat(filePath)

    // If 0 return true as the file is empty
    if (size === 0) return true

    // Else return false
    return false
  }

  // If file doesn't exist return true by default
  return true
}

/**
 * Check if file exists and if is empty
 * Throw proper error messages
 * @param {string} filePath
 */
const validateFile = async (filePath = BOARD_DB) => {
  // Check if exist
  const ifExists = await checkIfExists(filePath)

  // If not throw File Error
  if (!ifExists) throw new FileError(filePath)

  // If is empty
  if (await checkIfEmpty(filePath)) throw new FileErrorEmpty(filePath)
}

module.exports = {
  validateFile,
  checkIfEmpty,
  checkIfExists
}
