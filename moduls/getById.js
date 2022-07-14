const fs = require('fs')
const { checkIfExists, BOARD_DB } = require('../utils/common')

exports.getBoardItem = async (id) => {
  let item = {}

  const ifExists = await checkIfExists(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

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
