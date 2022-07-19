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

const updateBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = toObject.findIndex(
      (element) => element.id === board.getId()
    )

    if (itemIdnex === -1) board.setChanged()

    if (itemIdnex !== -1) {
      const compared = board.compare(toObject[itemIdnex])

      toObject.splice(itemIdnex, 1, compared)
    }

    callback(null, stringify(toObject) ?? chunk)
  }
})

/**
 *
 * @param {Record<string, string | Record<string, string | string[]>>} data
 * @returns
 */
exports.updateRecord = async (data) => {
  const ifExists = await checkIfExists(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  const writeStream = fs.createWriteStream(BOARD_DB)

  board.setAll(data)

  const readStream = fs.createReadStream(BOARD_DB)

  createBackup(readStream)

  // During update only board elements are changed
  // To update cards field we need to go under correct url path
  readStream.pipe(updateBoardItem).pipe(writeStream)

  return new Promise((resolve, rejects) => {
    writeStream.on('finish', () => {
      if (!board.getChanged())
        rejects(new Error(`No data for given id found: ${data.id}`))
      resolve(board.getAll())
    })
    writeStream.on('error', (error) => rejects(error))
    readStream.on('error', (error) => rejects(error))
  })
}
