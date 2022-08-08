const fs = require('fs')
const { Transform } = require('stream')
const { board } = require('../../models/index')
const { variable, validation, backupUtils, common } = require('../../lib/index')

const { BOARD_DB } = variable

const addNew = new Transform({
  transform(chunk, encoding, callback) {
    // Parse
    let parse = JSON.parse(chunk.toString())

    // Add value to existing array
    parse.push(board.getAll())

    callback(null, common.stringify(parse))
  }
})

/**
 * Creates file if not exists, and adds new record to DB
 * If db contains some elements, transform stream is called to manipulate data
 * @param {Record<string, string | string[] | number>} body
 */
exports.addNewRecord = async (body) => {
  // Check if file exists
  const ifExists = await validation.checkIfExists()

  // Check if file is empty
  const ifEmpty = await validation.checkIfEmpty()

  // Create write stream
  const writeStream = fs.createWriteStream(BOARD_DB, { encoding: 'utf-8' })

  // If file exists and its not empty call transform
  if (ifExists && !ifEmpty) {
    const readStream = fs.createReadStream(BOARD_DB, { encoding: 'utf-8' })

    // Create backup file just in case
    backupUtils.createBackup(readStream)

    // Set body to have access in transform
    board.setAll(body)

    // Edit existing file
    readStream.pipe(addNew).pipe(writeStream)
  }

  if (!ifExists || ifEmpty) writeStream.write(common.stringify([body]))
}
