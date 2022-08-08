const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board, card } = require('../../models/index')

const deleteCardItem = new Transform({
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

      // If itemIndex is not -1 then delete element from array
      if (cardIndex !== -1) {
        card.setAll(boardCards[cardIndex])

        boardCards.splice(cardIndex, 1)
      }
    }

    callback(null, common.stringify(toObject) ?? chunk)
  }
})

/**
 * Delete card item
 * @param {string} boardId
 * @param {string} cardId
 * @returns {Promise<Record<string, string | number | Date | Recor<string, unknown>[]> | Error>}
 */
exports.deleteCard = async (boardId, cardId) => {
  // Validate file
  await validation.validateFile()

  // Get read and write streams
  const { readStream, writeStream } = common.streamHandler()

  // Set board id
  board.setId(boardId)

  // Set card id
  card.setId(cardId)

  // Save changes
  readStream.pipe(deleteCardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      // Throw error if record doesn't exist
      if (!board.getRecordExists()) rejects(new errors.NoDataFound(boardId))
      if (!card.getRecordExists()) rejects(new errors.NoDataFound(cardId, true))

      // Resolve card data
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
