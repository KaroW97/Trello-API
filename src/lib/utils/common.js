const { v4: uuid } = require('uuid')
const Chance = require('chance')
const chance = new Chance()
const fs = require('fs')
const { BOARD_DB } = require('./variables')
const { createBackup } = require('./backupUtils')

/**
 * Stringify object
 * @param {Record<string, unknown>[]} data
 * @returns {string}
 */
const stringify = (data) => JSON.stringify(data, null, 2)

/**
 * Returns index of the element
 * @param {Record<string, string>[]} object
 * @param {string} id
 * @returns {number}
 */
const findIndex = (array, id) => array.findIndex((item) => item.id === id)

/**
 * Find proper element by id
 * @param {Record<string, string>[]} array
 * @param {string} id
 * @returns {Record<string, string>}
 */
const filter = (array, id) => array.filter((item) => item.id === id)

/**
 * Creates body for new board or card element
 * @param {Record<string, string>} body
 * @returns {Record<string, string>[]}
 */
const createBoard = (body) => ({
  id: uuid(),
  createAt: new Date(),
  ...body
})

/**
 * Creates dummy card value
 * @returns {Record<string, Date | string | string[] | number}
 */
const createRandomCard = () => ({
  id: uuid(),
  name: chance.name(),
  description: chance.string(),
  createAt: chance.date(),
  estimate: chance.date(),
  status: chance.integer({ min: -20, max: 20 }),
  dueDate: chance.date(),
  labels: [chance.string()]
})

/**
 * Returns array of cards
 * @returns { Record<string, string |string[]| number | Date>[]}
 */
const randomCardArray = () => {
  let randomArray = []
  for (let i = 0; i < 3; i++) randomArray.push(createRandomCard())

  return randomArray
}

/**
 * Returns write and read streams
 * @param {string} fileName
 * @returns {writeStream: fs.WriteStream;readStream: fs.ReadStream;}
 */
const streamHandler = (fileName = BOARD_DB) => {
  const writeStream = fs.createWriteStream(fileName)

  const readStream = fs.createReadStream(fileName)

  // Create backup
  createBackup(readStream)

  return {
    writeStream,
    readStream
  }
}

/**
 * Creates error message
 * @param {Record<string, unknown>} param0
 * @returns {Record<string, Record<string, unknown>>}
 */
const errorMessage = ({ name, message, status }) => ({
  error: { status, name, message }
})

/**
 * Creates success message
 * @param {string} type
 * @param {Record<string, unknown> | string } message
 * @param {Record<string, unknown> } details
 * @returns {Record<string, Record<string, unknown>>}
 */
const successMessage = (type, message, details) =>
  JSON.parse(
    JSON.stringify({
      data: {
        type,
        message,
        details
      }
    })
  )

module.exports = {
  stringify,
  createBoard,
  randomCardArray,
  streamHandler,
  errorMessage,
  findIndex,
  successMessage,
  filter
}
