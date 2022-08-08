const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board } = require('../../models/index')

const updateBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    // Parse
    const toObject = JSON.parse(chunk.toString())

    // Get item board index
    const itemIdnex = common.findIndex(toObject, board.getId())

    // If itemIndex is -1 setRecordExists field to false
    if (itemIdnex === -1) board.setRecordExists()

    // If itemIndex is not -1 change current item to new one
    if (itemIdnex !== -1) {
      // Update current item with new data
      const compared = board.compare(toObject[itemIdnex])

      // Change element to new one
      toObject.splice(itemIdnex, 1, compared)
    }

    callback(null, common.stringify(toObject) ?? chunk)
  }
})

/**
 * Update record with given data
 * @param {Record<string, number | Data | string | Record<string, string | string[]>>} data
 * @returns {Promise<Record<string, number | Data | string | Record<string, string | string[]>> | Error>}
 */
exports.updateRecord = async (data) => {
  // Validate file
  await validation.validateFile()

  // Get read and write streams
  const { readStream, writeStream } = common.streamHandler()

  // Set data
  board.setAll(data)

  // Save changes
  readStream.pipe(updateBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      // Throw error if record doesn't exist
      if (!board.getRecordExists()) rejects(new errors.NoDataFound(data.id))

      // Resolve board data
      resolve(board.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
