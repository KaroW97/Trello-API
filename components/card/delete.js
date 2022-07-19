const { Transform } = require('stream')
const {
  checkIfExists,
  stringify,
  createBackup,
  BOARD_DB
} = require('../../utils/common')
const fs = require('fs')
const Board = require('../../objectModuls/Board')
const Card = require('../../objectModuls/Card')
const board = new Board()
const card = new Card()

const deleteCardItem = new Transform({
  transform(chunk, encoding, callback) {
    const getId = board.getId()
    const getCardId = card.getId()

    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = toObject.findIndex((element) => element.id === getId)

    if (itemIdnex === -1) board.setChanged()

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
  const ifExists = await checkIfExists(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  const writeStream = fs.createWriteStream(BOARD_DB)

  board.setId(boardId)

  card.setId(cardId)

  const readStream = fs.createReadStream(BOARD_DB)

  createBackup(readStream)

  readStream.pipe(deleteCardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getChanged())
        rejects(
          new Error(`DELETE: No data for given board id found: ${boardId}`)
        )
      if (!card.getRecordExists())
        rejects(new Error(`DELETE: No data for given card id found: ${cardId}`))
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
