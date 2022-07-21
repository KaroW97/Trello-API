const { Transform } = require('stream')
const {
  stringify,
  BOARD_DB,
  validateFile,
  streamHandler
} = require('../../utils/common')
const Board = require('../../objectModuls/Board')
const { BadRequest } = require('../../utils/errors')
const board = new Board()

const deleteBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const getId = board.getId()

    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = toObject.findIndex((element) => element.id === getId)

    if (itemIdnex === -1) board.setRecordExists()

    if (itemIdnex !== -1) {
      board.setAll(toObject[itemIdnex])

      toObject.splice(itemIdnex, 1)
    }

    callback(null, stringify(toObject) ?? chunk)
  }
})

exports.deleteRecord = async (id) => {
  await validateFile(BOARD_DB)

  const { readStream, writeStream } = streamHandler(BOARD_DB)

  board.setId(id)

  readStream.pipe(deleteBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists())
        rejects(new BadRequest(`No data for given id found: ${id}`))
      resolve(board.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
