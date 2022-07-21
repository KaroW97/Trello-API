const { Transform } = require('stream')
const {
  stringify,
  validateFile,
  BOARD_DB,
  streamHandler
} = require('../../utils/common')
const Board = require('../../objectModuls/Board')
const Card = require('../../objectModuls/Card')
const { NoDataFound } = require('../../utils/errors')
const board = new Board()
const card = new Card()

const updateBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = toObject.findIndex(
      (element) => element.id === board.getId()
    )

    if (itemIdnex === -1) board.setRecordExists()

    if (itemIdnex !== -1) {
      const cardIndex = toObject[itemIdnex].cards.findIndex(
        (c) => c.id === card.getId()
      )

      if (cardIndex === -1) card.setRecordExists()

      if (cardIndex !== -1) {
        const compared = card.compare(toObject[itemIdnex].cards[cardIndex])

        card.setAll(compared)

        toObject[itemIdnex].cards.splice(cardIndex, 1, compared)
      }
    }

    callback(null, stringify(toObject) ?? chunk)
  }
})

/**
 *
 * @param {Record<string, string | Record<string, string | string[]>>} data
 * @returns
 */
exports.updateCard = async (data) => {
  await validateFile(BOARD_DB)

  const { readStream, writeStream } = streamHandler(BOARD_DB)

  board.setId(data.boardId)

  card.setAll(data)

  // During update only board elements are changed
  // To update cards field we need to go under correct url path
  readStream.pipe(updateBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists()) rejects(new NoDataFound(data.boardId))
      if (!card.getRecordExists()) rejects(new NoDataFound(data.id, true))

      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
