const fs = require('fs')
const { errors, variable, validation } = require('../../lib/index')

/**
 * Displays all elements from db
 * @param {Response<any, Record<string, any>, number>} res
 * @returns  {Promise<Response<any, Record<string, any>, number> | Error>}
 */
exports.getAll = async (res) => {
  // Validate file
  await validation.validateFile()

  // Create read stream
  const readStream = fs.createReadStream(variable.BOARD_DB)

  // When data, display
  readStream.on('data', (data) => res.write(data))

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => resolve(res.end()))
    readStream.on('error', () => rejects(new errors.TransferError()))
  })
}
