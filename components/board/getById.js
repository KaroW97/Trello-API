const fs = require('fs')
const { BOARD_DB, validateFile } = require('../../utils/common')

exports.getBoardItem = async (id) => {
  let item = {}

  await validateFile(BOARD_DB)

  const readStream = fs.createReadStream(BOARD_DB, { encoding: 'utf-8' })

  readStream.on('data', (data) => {
    const parse = JSON.parse(data)

    item = parse.filter((element) => element.id === id)
  })

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => {
      if (!item.length) rejects(new Error(`No data for given id ${id}`))
      resolve(item)
    })
    readStream.on('error', (error) => rejects(error))
  })
}
