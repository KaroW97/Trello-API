const { Transform } = require('stream')
const {
  stringify,
  BOARD_DB,
  validateFile,
  streamHandler
} = require('../../utils/common')
const Board = require('../../objectModuls/Board')
const Card = require('../../objectModuls/Card')
const { NoDataFound } = require('../../utils/errors')
const board = new Board()
const card = new Card()

const deleteCardItem = new Transform({
  transform(chunk, encoding, callback) {
    const getId = board.getId()
    const getCardId = card.getId()

    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = toObject.findIndex((element) => element.id === getId)

    if (itemIdnex === -1) board.setRecordExists()

    if (itemIdnex !== -1) {
      // board.setAll(toObject[itemIdnex])
      const cardIndex = toObject[itemIdnex].cards.findIndex(
        (card) => card.id === getCardId
      )

      if (cardIndex === -1) card.setRecordExists()

      if (cardIndex !== -1) {
        card.setAll(toObject[itemIdnex].cards[cardIndex])

        toObject[itemIdnex].cards.splice(cardIndex, 1)
      }
    }

    callback(null, stringify(toObject) ?? chunk)
  }
})

exports.deleteCard = async (boardId, cardId) => {
  await validateFile(BOARD_DB)

  const { readStream, writeStream } = streamHandler(BOARD_DB)

  board.setId(boardId)

  card.setId(cardId)

  readStream.pipe(deleteCardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists()) rejects(new NoDataFound(boardId))
      if (!card.getRecordExists()) rejects(new NoDataFound(cardId, true))
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
