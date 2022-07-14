const { Transform } = require('stream')
const {
  checkIfExists,
  stringify,
  createBackup,
  BOARD_DB
} = require('../utils/common')
const fs = require('fs')

const deleteBracket = new Transform({
  transform(chunk, encoding, callback) {
    const indexOfBracket = chunk.indexOf('[')
    const slicedString = chunk.slice(indexOfBracket + 1)

    callback(null, slicedString.toString())
  }
})

exports.addNewRecord = async (joiBody) => {
  const ifExists = await checkIfExists(BOARD_DB)

  const writeStream = fs.createWriteStream(BOARD_DB, { encoding: 'utf-8' })

  if (ifExists) {
    const readStream = fs.createReadStream(BOARD_DB, { encoding: 'utf-8' })

    readStream.pipe(deleteBracket).pipe(writeStream)

    createBackup(readStream)

    writeStream.write('[' + stringify(joiBody) + ', ')
  }

  if (!ifExists) writeStream.write(stringify([joiBody]))
}
