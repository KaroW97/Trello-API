const Joi = require('joi')

const schemaCreateBoard = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  color: Joi.string().required(),
  description: Joi.string().required(),
  createAt: Joi.date().required(),
  cards: Joi.array().required()
})

const schemaUpdateBoard = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  color: Joi.string(),
  description: Joi.string(),
  createAt: Joi.date(),
  cards: Joi.array()
})

const schemaCreateCard = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  createAt: Joi.date().required(),
  estimate: Joi.date().required(),
  status: Joi.number().required(),
  dueDate: Joi.date().required(),
  labels: Joi.array().items(Joi.string()).required()
})

const schemaUpdateCard = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  description: Joi.string(),
  createAt: Joi.date(),
  estimate: Joi.date(),
  status: Joi.number(),
  dueDate: Joi.date(),
  labels: Joi.array().items(Joi.string())
})

module.exports = {
  schemaCreateBoard,
  schemaUpdateBoard,
  schemaCreateCard,
  schemaUpdateCard
}
