const { Transform } = require('stream')
const {
  checkIfExists,
  stringify,
  createBackup,
  BOARD_DB,
  checkIfEmpty
} = require('../../utils/common')
const fs = require('fs')
const Board = require('../../objectModuls/Board')
const board = new Board()

const deleteBracket = new Transform({
  transform(chunk, encoding, callback) {
    let toObject = JSON.parse(chunk.toString())

    toObject.push(board.getAll())

    callback(null, stringify(toObject))
  }
})

exports.addNewRecord = async (body) => {
  const ifExists = await checkIfExists()

  const ifEmpty = await checkIfEmpty()

  const writeStream = fs.createWriteStream(BOARD_DB, { encoding: 'utf-8' })

  if (ifExists && !ifEmpty) {
    const readStream = fs.createReadStream(BOARD_DB, { encoding: 'utf-8' })

    createBackup(readStream)

    board.setAll(body)

    readStream.pipe(deleteBracket).pipe(writeStream)
  }

  if (!ifExists || ifEmpty) writeStream.write(stringify([body]))
}
