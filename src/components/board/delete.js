const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board } = require('../../modules/index')

const deleteBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = common.findIndex(toObject, board.getId())

    if (itemIdnex === -1) board.setRecordExists()

    if (itemIdnex !== -1) {
      board.setAll(toObject[itemIdnex])

      toObject.splice(itemIdnex, 1)
    }

    callback(null, common.stringify(toObject) ?? chunk)
  }
})

exports.deleteRecord = async (id) => {
  await validation.validateFile()

  const { readStream, writeStream } = common.streamHandler()

  board.setId(id)

  readStream.pipe(deleteBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists())
        rejects(new errors.BadRequest(`No data for given id found: ${id}`))
      resolve(board.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
