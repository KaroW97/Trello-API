const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board } = require('../../modules/index')

const updateBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = common.findIndex(toObject, board.getId())

    if (itemIdnex === -1) board.setRecordExists()

    if (itemIdnex !== -1) {
      const compared = board.compare(toObject[itemIdnex])

      toObject.splice(itemIdnex, 1, compared)
    }

    callback(null, common.stringify(toObject) ?? chunk)
  }
})

/**
 *
 * @param {Record<string, string | Record<string, string | string[]>>} data
 * @returns
 */
exports.updateRecord = async (data) => {
  await validation.validateFile()

  const { readStream, writeStream } = common.streamHandler()

  board.setAll(data)

  // During update only board elements are changed
  // To update cards field we need to go under correct url path
  readStream.pipe(updateBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists()) rejects(new errors.NoDataFound(data.id))
      resolve(board.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
