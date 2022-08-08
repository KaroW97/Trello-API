const { addNewRecord } = require('./board/add')
const { getAll } = require('./board/getAll')
const { deleteRecord } = require('./board/delete')
const { getBoardItem } = require('./board/getById')
const { updateRecord } = require('./board/update')

const { addNewCard } = require('./card/add')
const { deleteCard } = require('./card/delete')
const { getAllCards } = require('./card/getAll')
const { getCardItem } = require('./card/getById')
const { updateCard } = require('./card/update')

module.exports = {
  board: {
    addNewRecord,
    getAll,
    deleteRecord,
    getBoardItem,
    updateRecord
  },
  card: {
    addNewCard,
    deleteCard,
    getAllCards,
    getCardItem,
    updateCard
  }
}
