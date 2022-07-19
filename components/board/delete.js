const { Transform } = require('stream')
const {
  checkIfExists,
  stringify,
  createBackup,
  BOARD_DB
} = require('../../utils/common')
const fs = require('fs')
const Board = require('../../objectModuls/Board')
const board = new Board()

const deleteBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const getId = board.getId()

    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = toObject.findIndex((element) => element.id === getId)

    if (itemIdnex === -1) board.setChanged()

    if (itemIdnex !== -1) {
      board.setAll(toObject[itemIdnex])

      toObject.splice(itemIdnex, 1)
    }

    callback(null, stringify(toObject) ?? chunk)
  }
})

exports.deleteRecord = async (id) => {
  const ifExists = await checkIfExists(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  const writeStream = fs.createWriteStream(BOARD_DB)

  board.setId(id)

  const readStream = fs.createReadStream(BOARD_DB)

  createBackup(readStream)

  readStream.pipe(deleteBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getChanged())
        rejects(new Error(`No data for given id found: ${id}`))
      resolve(board.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
