const fs = require('fs')
const { errors, variable, validation } = require('../../lib/index')

exports.getAll = async (res) => {
  await validation.validateFile()

  const readStream = fs.createReadStream(variable.BOARD_DB)

  readStream.on('data', (data) => res.write(data))

  return new Promise((resolve, rejects) => {
    readStream.on('end', () => resolve(res.end()))
    readStream.on('error', () => rejects(new errors.TransferError()))
  })
}
