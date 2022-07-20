const { Transform } = require('stream')
const {
  stringify,
  BOARD_DB,
  validateFile,
  streamHandler
} = require('../../utils/common')
const Board = require('../../objectModuls/Board')
const board = new Board()

const updateBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = toObject.findIndex((item) => item.id === board.getId())

    if (itemIdnex === -1) board.setRecordExists()

    if (itemIdnex !== -1) {
      const compared = board.compare(toObject[itemIdnex])

      toObject.splice(itemIdnex, 1, compared)
    }

    callback(null, stringify(toObject) ?? chunk)
  }
})

/**
 *
 * @param {Record<string, string | Record<string, string | string[]>>} data
 * @returns
 */
exports.updateRecord = async (data) => {
  await validateFile(BOARD_DB)

  const { readStream, writeStream } = streamHandler(BOARD_DB)

  board.setAll(data)

  // During update only board elements are changed
  // To update cards field we need to go under correct url path
  readStream.pipe(updateBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists())
        rejects(new Error(`No data for given id found: ${data.id}`))
      resolve(board.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
