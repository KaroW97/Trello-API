const { v4: uuid } = require('uuid')
const { Transform } = require('stream')
const fs = require('fs')
const { checkIfExists, stringify, createBackup } = require('./common')
const Board = require('./Board')
const { logger } = require('./logger')
const board = new Board()

const BOARD_DB = './localDB/board.json'

const createBoard = (body) => ({
  id: uuid(),
  ...body
})

const deleteBracket = new Transform({
  transform(chunk, encoding, callback) {
    const indexOfBracket = chunk.indexOf('[')
    const slicedString = chunk.slice(indexOfBracket + 1)

    callback(null, slicedString.toString())
  }
})

const addNewRecord = async (joiBody) => {
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

const editBoardItem = new Transform({
  transform(chunk, encoding, callback) {
    const getId = board.getId()

    const toObject = JSON.parse(chunk.toString())

    const itemIdnex = toObject.findIndex((element) => element.id === getId)

    if (itemIdnex === -1) logger.error(`No data for given id found ${getId}`)

    if (itemIdnex !== -1) {
      const compared = board.compare(toObject[itemIdnex])

      toObject.splice(itemIdnex, 1, compared)
    }

    callback(null, stringify(toObject) ?? chunk)
  }
})

const updateRecord = async (data) => {
  const ifExists = await checkIfExists(BOARD_DB)

  const writeStream = fs.createWriteStream(BOARD_DB)

  if (!ifExists) throw new Error('File does not exist')

  board.setAll(data)

  const readStream = fs.createReadStream(BOARD_DB)

  createBackup(readStream)

  readStream.pipe(editBoardItem).pipe(writeStream)
}

module.exports = {
  addNewRecord,
  createBoard,
  editBoardItem,
  updateRecord
}
