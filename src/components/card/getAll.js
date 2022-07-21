const fs = require('fs')
const { errors, variable, validation } = require('../../lib/index')

exports.getAllCards = async (boardId) => {
  let item = {}
  await validation.validateFile()

  const readStream = fs.createReadStream(variable.BOARD_DB)

  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    const boardItem = parse.filter((board) => board.id === boardId)[0]

    if (boardItem) item = boardItem.cards
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      if (!item.length) rejects(new errors.NoDataFound(boardId))
      resolve(item)
    })
    readStream.on('error', () => rejects(new errors.TransferError()))
  })
}
