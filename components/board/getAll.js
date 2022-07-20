const fs = require('fs')
const { BOARD_DB, validateFile } = require('../../utils/common')

exports.getAll = async (res) => {
  await validateFile(BOARD_DB)

  const readStream = fs.createReadStream(BOARD_DB)

  readStream.on('data', (data) => res.write(data))

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => resolve(res.end()))
    readStream.on('error', () =>
      rejects(new Error('Error occurred during transfer'))
    )
  })
}
