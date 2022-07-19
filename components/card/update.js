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

const updateBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = toObject.findIndex(
      (element) => element.id === board.getId()
    )

    if (itemIdnex === -1) board.setChanged()

    if (itemIdnex !== -1) {
      const cardIndex = toObject[itemIdnex].cards.findIndex(
        (c) => c.id === card.getId()
      )

      if (cardIndex === -1) card.setRecordExists()

      if (cardIndex !== -1) {
        const compared = card.compare(toObject[itemIdnex].cards[cardIndex])

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
  const ifExists = await checkIfExists(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  const writeStream = fs.createWriteStream(BOARD_DB)

  board.setId(data.boardId)

  card.setAll(data)

  const readStream = fs.createReadStream(BOARD_DB)

  createBackup(readStream)

  // During update only board elements are changed
  // To update cards field we need to go under correct url path
  readStream.pipe(updateBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getChanged())
        rejects(
          new Error(`DELETE: No data for given board id found: ${data.boardId}`)
        )
      if (!card.getRecordExists())
        rejects(
          new Error(`DELETE: No data for given card id found: ${data.id}`)
        )
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
