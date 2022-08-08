const express = require('express')
const bodyParser = require('body-parser')
const { Card, Board } = require('./src/index')
const helmet = require('helmet')
const { logger, common, errors } = require('./src/lib/index')
require('dotenv').config();

const app = express()

app.use(bodyParser.json())
app.use(helmet())

app.use('/', Board)
app.use('/card', Card)

/**
 * When page is not in the scope throw error
 */
app.use((req, res) => {
  res.status(404)

  logger.error('PAGE_LOAD_ERROR', new errors.NotFound())

  res.send(common.errorMessage(new errors.NotFound()))
})

app.listen(process.env.PORT || 3000)
