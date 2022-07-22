const fs = require('fs')
const { errors, variable, validation } = require('../../lib/index')

/**
 * Get all data for given board id
 * @param {string} boardId
 * @returns {Promise<Record<string, string | number | Date | Recor<string, unknown>[]> | Error>}
 */
exports.getAllCards = async (boardId) => {
  let item = {}

  // Validate file
  await validation.validateFile()

  // Create read stream
  const readStream = fs.createReadStream(variable.BOARD_DB)

  // When data search for the card with given id then assing it to item veriabel
  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    const boardItem = parse.filter((board) => board.id === boardId)[0]

    if (boardItem) item = boardItem.cards
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      // Throw error if item is empty
      if (!item.length) rejects(new errors.NoDataFound(boardId))

      // Resolve board data
      resolve(item)
    })
    readStream.on('error', () => rejects(new errors.TransferError()))
  })
}
