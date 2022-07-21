const fs = require('fs')
const { errors, validation, variable } = require('../../lib/index')

exports.getBoardItem = async (id) => {
  let item = {}

  await validation.validateFile()

  const readStream = fs.createReadStream(variable.BOARD_DB, {
    encoding: 'utf-8'
  })

  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    item = parse.filter((element) => element.id === id)
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      if (!item.length) rejects(new errors.NoDataFound(id))
      resolve(item)
    })
    readStream.on('error', (error) => rejects(error))
  })
}
