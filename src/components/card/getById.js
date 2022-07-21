const fs = require('fs')
const { errors, validation, variable } = require('../../lib/index')

exports.getCardItem = async (boardId, cardId) => {
  let boardItem = {}

  await validation.validateFile()

  const readStream = fs.createReadStream(variable.BOARD_DB, {
    encoding: 'utf-8'
  })

  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    const boardRecord = parse.filter((board) => board.id === boardId)

    boardItem = boardRecord
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      if (!boardItem.length) rejects(new errors.NoDataFound(boardId))
    })

    readStream.on('close', () => {
      const item = boardItem[0].cards.filter((card) => card.id === cardId)

      if (!item.length) rejects(new errors.NoDataFound(cardId, true))

      resolve(item)
    })
    readStream.on('error', (error) => rejects(error))
  })
}