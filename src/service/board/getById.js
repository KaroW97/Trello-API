const { errors, validation, common } = require('../../lib/index')

/**
 * Returns item with given id from DB
 * @param {string} id
 * @returns {Promise<Record<string, Record<string, unknown>[] | string | number | Data> | Error>}
 */
exports.getBoardItem = async (id) => {
  let item = {}

  // Validate file
  await validation.validateFile()

  // Create read stream
  const { readStream } = await common.streamHandler()

  // When data search for the one with proper id
  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    item = parse.filter((element) => element.id === id)
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      // Throw error if record doesn't exist
      if (!item.length) rejects(new errors.NoDataFound(id))

      // Resolve card data
      resolve(item)
    })
  })
}
