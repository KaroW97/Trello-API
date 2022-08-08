const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board, card } = require('../../models/index')

const updateBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    // Parse
    const toObject = JSON.parse(chunk.toString())

    // Get item board index
    const boardIdnex = common.findIndex(toObject, board.getId())

    // If itemIndex is -1 setRecordExists field to false
    if (boardIdnex === -1) board.setRecordExists()

    // If itemIndex is not -1
    if (boardIdnex !== -1) {
      const boardCards = toObject[boardIdnex].cards

      // Get item card index
      const cardIndex = common.findIndex(boardCards, card.getId())

      // If cardIndex is -1 setRecordExists field to false
      if (cardIndex === -1) card.setRecordExists()

      // If itemIndex is not -1 change current item to new one
      if (cardIndex !== -1) {
        // Update current item with new data
        const compared = card.compare(boardCards[cardIndex])

        // Set card elements to retrieve later
        card.setAll(compared)

        // Change element to new one
        boardCards.splice(cardIndex, 1, compared)
      }
    }

    callback(null, common.stringify(toObject) ?? chunk)
  }
})

/**
 * Update card item
 * @param {Record<string, string | Record<string, string | string[]>>} data
 * @returns {Promise<Record<string, string | number | Date | Recor<string, unknown>[]> | Error>}
 */
exports.updateCard = async (data) => {
  const { id, boardId } = data
  // Validate file
  await validation.validateFile()

  // Get read and write streams
  const { readStream, writeStream } = common.streamHandler()

  // Set board id
  board.setId(boardId)

  // Set card data
  card.setAll(data)

  // Save changes
  readStream.pipe(updateBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      // Throw error if record doesn't exist
      if (!board.getRecordExists()) rejects(new errors.NoDataFound(boardId))
      if (!card.getRecordExists()) rejects(new errors.NoDataFound(id, true))

      // Resolve card data
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
