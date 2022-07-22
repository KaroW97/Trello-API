const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board } = require('../../modules/index')

const deleteBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    // Parse
    const parse = JSON.parse(chunk.toString())

    // Get item board index
    const itemIdnex = common.findIndex(parse, board.getId())

    // If itemIndex is -1 setRecordExists field to false
    if (itemIdnex === -1) board.setRecordExists()

    // If itemIndex is not -1 then delete element from array
    if (itemIdnex !== -1) {
      // Set board values to retrive them later
      board.setAll(parse[itemIdnex])

      parse.splice(itemIdnex, 1)
    }

    callback(null, common.stringify(parse) ?? chunk)
  }
})

/**
 * Deletes item with given id from DB
 * @param {string} id
 * @returns {Promise<Record<string, string | string[] | number | Date | Error}
 */
exports.deleteRecord = async (id) => {
  // Validate file
  await validation.validateFile()

  // Get read and write streams
  const { readStream, writeStream } = common.streamHandler()

  // Set id
  board.setId(id)

  // Save changes
  readStream.pipe(deleteBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      // Throw error if record doesn't exist
      if (!board.getRecordExists())
        rejects(new errors.BadRequest(`No data for given id found: ${id}`))

      // Resolve card data
      resolve(board.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
