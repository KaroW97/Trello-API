const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board, card } = require('../../models/index')

const addNew = new Transform({
  transform(chunk, encoding, callback) {
    // Parse
    const toObject = JSON.parse(chunk.toString())

    // Get item board index
    const itemIndex = common.findIndex(toObject, board.getId())

    // If itemIndex is -1 setRecordExists field to false
    if (itemIndex === -1) board.setRecordExists()

    // If itemIndex is not -1 then add new card
    if (itemIndex !== -1) toObject[itemIndex].cards.push(card.getAll())

    callback(null, common.stringify(toObject) ?? chunk)
  }
})

/**
 * Add new card to existing board element
 * @param {Record<string, string | Recor<string, unknown>[] | number | Date>} data
 * @returns {Promise<Record<string, string | Recor<string, unknown>[] | number | Date> | Error>}
 */
exports.addNewCard = async (body) => {
  // Validate file
  await validation.validateFile()

  // Get read and write streams
  const { readStream, writeStream } = common.streamHandler()

  // Set id
  board.setId(body.boardId)

  // set card values
  card.setAll(body)

  // Save changes
  readStream.pipe(addNew).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      // Throw error if record doesn't exist
      if (!board.getRecordExists())
        rejects(new errors.NoDataFound(body.boardId))

      // Resolve board data
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
