const fs = require('fs')
const { Transform } = require('stream')
const { board } = require('../../modules/index')
const { variable, validation, backupUtils, common } = require('../../lib/index')

const { BOARD_DB } = variable

const deleteBracket = new Transform({
  transform(chunk, encoding, callback) {
    let toObject = JSON.parse(chunk.toString())

    toObject.push(board.getAll())

    callback(null, common.stringify(toObject))
  }
})

exports.addNewRecord = async (body) => {
  const ifExists = await validation.checkIfExists()

  const ifEmpty = await validation.checkIfEmpty()

  const writeStream = fs.createWriteStream(BOARD_DB, { encoding: 'utf-8' })

  if (ifExists && !ifEmpty) {
    const readStream = fs.createReadStream(BOARD_DB, { encoding: 'utf-8' })

    backupUtils.createBackup(readStream)

    board.setAll(body)

    readStream.pipe(deleteBracket).pipe(writeStream)
  }

  if (!ifExists || ifEmpty) writeStream.write(common.stringify([body]))
}
