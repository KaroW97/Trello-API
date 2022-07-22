const { createBoard } = require('../utils/common')
const cache = require('memory-cache')
const {
  schemaCreateBoard,
  schemaUpdateBoard,
  schemaCreateCard,
  schemaUpdateCard
} = require('./joiSchemas')

/**
 * Checks if provided data is covering with created joi schema
 * @param {Record<string, unknown>} data
 * @param {Joi.ObjectSchema<any>} schema
 * @returns {Record<string, unknown>}
 */
const joiValidate = (data, schema) => {
  // Validate
  const checkSchema = schema.validate(data)

  // If error throw
  if (checkSchema.error) throw checkSchema.error

  // Return data
  return checkSchema.value
}

/**
 * Returns Joi schema object
 * @param {boolean} isCreate - by default the create schema is taken
 * @returns {Promise<Joi.ObjectSchema<any>>}
 */
const checkIfCard = async (isCreate = true) => {
  // Default value is board schemas
  let schemaUpdateType = isCreate ? schemaCreateBoard : schemaUpdateBoard

  // Check if there is CARD value in cache
  const isCard = await cache.get('CARD')

  // If yes change schema type to card one
  if (isCard) schemaUpdateType = isCreate ? schemaCreateCard : schemaUpdateCard

  return schemaUpdateType
}
/**
 *
 * @param {Record<string, unknown>} data
 * @returns {Record<string, unknown>}
 */
const joiUpdateItem = async (data) => {
  // Check if cache has specific value in
  const schemaUpdateType = await checkIfCard(false)

  // Validate and return data
  return joiValidate(data, schemaUpdateType)
}

const joiCreateItem = async (data) => {
  // Check if cache has specific value in
  const schemaUpdateType = await checkIfCard()

  // create board body
  const board = createBoard(data)

  // Validate and return data
  return joiValidate(board, schemaUpdateType)
}

module.exports = {
  joiCreateItem,
  joiUpdateItem
}
