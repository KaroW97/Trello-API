const { createBoard } = require('../utils/common')
const cache = require('memory-cache')
const {
  schemaCreateBoard,
  schemaUpdateBoard,
  schemaCreateCard,
  schemaUpdateCard
} = require('./joiSchemas')

const joiValidate = (data, schema) => {
  const checkSchema = schema.validate(data)

  if (checkSchema.error) throw checkSchema.error

  return checkSchema.value
}

const joiUpdateItem = async (data) => {
  let schemaUpdateType = schemaUpdateBoard

  const isCard = await cache.get('CARD')

  console.log(isCard)
  if (isCard) schemaUpdateType = schemaUpdateCard

  return joiValidate(data, schemaUpdateType)
}

const joiCreateItem = async (data) => {
  let schemaUpdateType = schemaCreateBoard

  const isCard = await cache.get('CARD')

  if (isCard) schemaUpdateType = schemaCreateCard

  const board = createBoard(data)

  return joiValidate(board, schemaUpdateType)
}

module.exports = {
  joiCreateItem,
  joiUpdateItem
}
