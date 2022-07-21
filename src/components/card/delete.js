const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board, card } = require('../../modules/index')

const deleteCardItem = new Transform({
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
        card.setAll(toObject[boardIdnex].cards[cardIndex])

        toObject[boardIdnex].cards.splice(cardIndex, 1)
      }
    }

    callback(null, common.stringify(toObject) ?? chunk)
  }
})

exports.deleteCard = async (boardId, cardId) => {
  await validation.validateFile()

  const { readStream, writeStream } = common.streamHandler()

  board.setId(boardId)

  card.setId(cardId)

  readStream.pipe(deleteCardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists()) rejects(new errors.NoDataFound(boardId))
      if (!card.getRecordExists()) rejects(new errors.NoDataFound(cardId, true))
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
