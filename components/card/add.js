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

const deleteBracket = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const itemIndex = toObject.findIndex((item) => item.id === board.getId())

    if (itemIndex === -1) board.setChanged()
    if (itemIndex !== -1) toObject[itemIndex].cards.push(card.getAll())

    callback(null, stringify(toObject) ?? chunk)
  }
})

exports.addNewCard = async (body) => {
  const ifExists = await checkIfExists(BOARD_DB)

  const writeStream = fs.createWriteStream(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  const readStream = fs.createReadStream(BOARD_DB)

  createBackup(readStream)

  board.setId(body.boardId)

  card.setAll(body)

  readStream.pipe(deleteBracket).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getChanged())
        rejects(
          new Error(`DELETE: No data for given board id found: ${body.boardId}`)
        )
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
