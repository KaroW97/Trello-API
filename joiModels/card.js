const Joi = require('joi')
const { createBoard } = require('../utils/common')

const schemaCreate = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  createAt: Joi.date().required(),
  estimate: Joi.date().required(),
  status: Joi.number().required(),
  dueDate: Joi.date().required(),
  labels: Joi.array().items(Joi.string()).required()
})

const schemaUpdate = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  description: Joi.string(),
  createAt: Joi.date(),
  estimate: Joi.date(),
  status: Joi.number(),
  dueDate: Joi.date(),
  labels: Joi.array().items(Joi.string())
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
