const { v4: uuid } = require('uuid')
const Chance = require('chance')
const chance = new Chance()
const fs = require('fs')
const { BOARD_DB } = require('./variables')
const { createBackup } = require('./backupUtils')

/**
 * Stringify object
 * @param {Record<string, unknown> || Record<string, unknown>[]} data
 * @returns
 */
const stringify = (data) => JSON.stringify(data, null, 2)

const findIndex = (object, id) => object.findIndex((item) => item.id === id)

const createBoard = (body) => ({
  id: uuid(),
  createAt: new Date(),
  ...body
})

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

const randomCardArray = () => {
  let randomArray = []
  for (let i = 0; i < 3; i++) randomArray.push(createRandomCard())

  return randomArray
}

const streamHandler = (fileName = BOARD_DB) => {
  const writeStream = fs.createWriteStream(fileName)

  const readStream = fs.createReadStream(fileName)

  createBackup(readStream)

  return {
    writeStream,
    readStream
  }
}

const errorMessage = ({ name, message }) => ({
  error: { name, message }
})

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
  successMessage
}
