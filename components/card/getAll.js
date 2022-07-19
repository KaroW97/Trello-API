const fs = require('fs')
const { BOARD_DB, checkIfExists } = require('../../utils/common')

exports.getAllCards = async (res, boardId) => {
  const ifExists = await checkIfExists(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  const readStream = fs.createReadStream(BOARD_DB, {
    encoding: 'utf-8'
  })

  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    const board = parse.filter((board) => board.id === boardId)[0]

    res.send(board.cards)
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => resolve(res.end()))
    readStream.on('error', () =>
      rejects(new Error('Error occurred during transfer'))
    )
  })
}
