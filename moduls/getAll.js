const fs = require('fs')
const { BOARD_DB, checkIfExists } = require('../utils/common')

exports.getAll = async (res) => {
  const ifExists = await checkIfExists(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  const readStream = fs.createReadStream(BOARD_DB, {
    encoding: 'utf-8'
  })

  readStream.on('data', (data) => res.write(data))

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => resolve(res.end()))
    readStream.on('error', () =>
      rejects(new Error('Error occurred during transfer'))
    )
  })
}
