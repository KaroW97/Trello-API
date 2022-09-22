const { errors, validation, common } = require('../../lib/index')

/**
 * Get card by id
 * @param {string} boardId
 * @param {string} cardId
 * @returns {Promise<Record<string, string | number | Date | Recor<string, unknown>[]> | Error>}
 */
exports.getCardItem = async (boardId, cardId) => {
  let boardItem = {}

  // Validate file
  await validation.validateFile()

  // Create read stream
  const { readStream } = await common.streamHandler()

  // When data search for the one with proper id
  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    const boardRecord = common.filter(parse, boardId)

    boardItem = boardRecord
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      // Throw error if boardItem is empty
      if (!boardItem.length) rejects(new errors.NoDataFound(boardId))
    })

    readStream.on('close', () => {
      const item = common.filter(boardItem[0].cards, cardId)

      // Throw error if item array is empty
      if (!item.length) rejects(new errors.NoDataFound(cardId, true))

      // Resolve card data
      resolve(item)
    })
  })
}
