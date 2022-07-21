const fs = require('fs')
const { validateFile, BOARD_DB } = require('../../utils/common')
const { NoDataFound } = require('../../utils/errors')

exports.getCardItem = async (boardId, cardId) => {
  let boardItem = {}

  await validateFile(BOARD_DB)

  const readStream = fs.createReadStream(BOARD_DB, { encoding: 'utf-8' })

  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    const boardRecord = parse.filter((board) => board.id === boardId)

    boardItem = boardRecord
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      if (!boardItem.length) rejects(new NoDataFound(boardId))
    })

    readStream.on('close', () => {
      const item = boardItem[0].cards.filter((card) => card.id === cardId)

      if (!item.length) rejects(new NoDataFound(cardId, true))

      resolve(item)
    })
    readStream.on('error', (error) => rejects(error))
  })
}
