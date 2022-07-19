const fs = require('fs')
const Board = require('../../objectModuls/Board')
const { checkIfExists, BOARD_DB } = require('../../utils/common')
const board = new Board()

exports.getCardItem = async (boardId, cardId) => {
  let boardItem = {}

  const ifExists = await checkIfExists(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  const readStream = fs.createReadStream(BOARD_DB, { encoding: 'utf-8' })

  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    const boardRecord = parse.filter((board) => board.id === boardId)

    if (!boardRecord.length) board.setRecordExists()

    boardItem = boardRecord
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      if (!board.getRecordExists())
        rejects(new Error(`No data for for given boardId ${boardId}`))
    })

    readStream.on('close', () => {
      const item = boardItem[0].cards.filter((card) => card.id === cardId)

      if (!item.length)
        rejects(new Error(`No data for for given card id ${cardId}`))

      resolve(item)
    })
    readStream.on('error', (error) => rejects(error))
  })
}
