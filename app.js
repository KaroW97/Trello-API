const express = require('express')
const bodyParser = require('body-parser')
const Card = require('./routes/card')
const Board = require('./routes/board')
const helmet = require('helmet')

const app = express()

app.use(bodyParser.json())
app.use(helmet())

app.use('/', Board)
app.use('/card', Card)

app.listen(3000)
