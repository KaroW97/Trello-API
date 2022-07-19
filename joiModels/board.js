const Joi = require('joi')
const { createBoard } = require('../utils/common')

const schemaCreate = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  color: Joi.string().required(),
  description: Joi.string().required(),
  createAt: Joi.date().required(),
  cards: Joi.array().required()
})

const schemaUpdate = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  color: Joi.string(),
  description: Joi.string(),
  createAt: Joi.date(),
  cards: Joi.array()
})

const joiValidate = (data, schema) => {
  const checkSchema = schema.validate(data)

  if (checkSchema.error) throw checkSchema.error

  return checkSchema.value
}

const joiUpdateItem = (data) => joiValidate(data, schemaUpdate)

const joiCreateItem = (data) => {
  const board = createBoard(data)

  return joiValidate(board, schemaCreate)
}

module.exports = {
  joiCreateItem,
  joiUpdateItem
}
