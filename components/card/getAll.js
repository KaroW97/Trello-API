const fs = require('fs')
const { BOARD_DB, validateFile } = require('../../utils/common')

exports.getAllCards = async (res, boardId) => {
  let item = {}
  await validateFile(BOARD_DB)

  const readStream = fs.createReadStream(BOARD_DB)

  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    const boardItem = parse.filter((board) => board.id === boardId)[0]

    if (boardItem) item = boardItem.cards
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      if (!item.length)
        rejects(new Error(`No data for given board id found: ${boardId}`))
      resolve(item)
    })
    readStream.on('error', () =>
      rejects(new Error('Error occurred during transfer'))
    )
  })
}
