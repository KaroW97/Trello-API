const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board, card } = require('../../modules/index')

const updateBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const boardIdnex = common.findIndex(toObject, board.getId())

    if (boardIdnex === -1) board.setRecordExists()

    if (boardIdnex !== -1) {
      const cardIndex = common.findIndex(
        toObject[boardIdnex].cards,
        card.getId()
      )

      if (cardIndex === -1) card.setRecordExists()

      if (cardIndex !== -1) {
        const compared = card.compare(toObject[boardIdnex].cards[cardIndex])

        card.setAll(compared)

        toObject[boardIdnex].cards.splice(cardIndex, 1, compared)
      }
    }

    callback(null, common.stringify(toObject) ?? chunk)
  }
})

/**
 *
 * @param {Record<string, string | Record<string, string | string[]>>} data
 * @returns
 */
exports.updateCard = async (data) => {
  await validation.validateFile()

  const { readStream, writeStream } = common.streamHandler()

  board.setId(data.boardId)

  card.setAll(data)

  // During update only board elements are changed
  // To update cards field we need to go under correct url path
  readStream.pipe(updateBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists())
        rejects(new errors.NoDataFound(data.boardId))
      if (!card.getRecordExists())
        rejects(new errors.NoDataFound(data.id, true))

      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
