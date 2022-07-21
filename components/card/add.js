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

const deleteBracket = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const itemIndex = toObject.findIndex((item) => item.id === board.getId())

    if (itemIndex === -1) board.setRecordExists()
    if (itemIndex !== -1) toObject[itemIndex].cards.push(card.getAll())

    callback(null, stringify(toObject) ?? chunk)
  }
})

exports.addNewCard = async (body) => {
  await validateFile(BOARD_DB)

  const { readStream, writeStream } = streamHandler(BOARD_DB)

  board.setId(body.boardId)

  card.setAll(body)

  readStream.pipe(deleteBracket).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists()) rejects(new NoDataFound(body.boardId))
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
