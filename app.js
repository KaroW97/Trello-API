const express = require('express')
const bodyParser = require('body-parser')
const Card = require('./routes/card')
const Board = require('./routes/board')
const helmet = require('helmet')
const logger = require('./logger/loggerUtils')

const app = express()

app.use(bodyParser.json())
app.use(helmet())

app.use('/', Board)
app.use('/card', Card)

app.use((req, res) => {
  res.status(404)

  logger.error('404: Page not found')

  if (req.accepts('html')) {
    res.send({ err: '404: Page not found' })
    return
  }

  res.send('Not found')
})

app.listen(3000)
