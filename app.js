const express = require('express')
const bodyParser = require('body-parser')
const { Card, Board } = require('./src/index')
const helmet = require('helmet')
const { logger, common, errors } = require('./src/lib/index')

const app = express()

app.use(bodyParser.json())
app.use(helmet())

app.use('/', Board)
app.use('/card', Card)

app.use((req, res) => {
  res.status(404)

  logger.error('PAGE_LOAD_ERROR', new errors.NotFound())

  if (req.accepts('html')) {
    res.send(common.errorMessage(new errors.NotFound()))
    return
  }

  res.send('Not found')
})

app.listen(3000)
