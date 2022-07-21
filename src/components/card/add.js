const { Transform } = require('stream')
const { errors, validation, common } = require('../../lib/index')
const { board, card } = require('../../modules/index')

const deleteBracket = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const itemIndex = common.findIndex(toObject, board.getId())

    if (itemIndex === -1) board.setRecordExists()
    if (itemIndex !== -1) toObject[itemIndex].cards.push(card.getAll())

    callback(null, common.stringify(toObject) ?? chunk)
  }
})

exports.addNewCard = async (body) => {
  await validation.validateFile()

  const { readStream, writeStream } = common.streamHandler()

  board.setId(body.boardId)

  card.setAll(body)

  readStream.pipe(deleteBracket).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getRecordExists())
        rejects(new errors.NoDataFound(body.boardId))
      resolve(card.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
