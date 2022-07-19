module.exports = class Board {
  constructor() {
    this.id = undefined
    this.name = undefined
    this.color = undefined
    this.description = undefined
    this.createAt = undefined
    this.cards = undefined
    this.changed = true
    this.recordExists = true
  }

  setId(id) {
    this.id = id
  }

  getId() {
    return this.id
  }

  setRecordExists() {
    this.recordExists = false
  }

  getRecordExists() {
    return this.recordExists
  }

  setChanged() {
    this.changed = false
  }

  getChanged() {
    return this.changed
  }

  compare(data) {
    let { id, name, color, description, createAt, cards } = data || {}

    if (this.name !== undefined && name !== this.name) name = this.name
    if (this.color !== undefined && color !== this.color) color = this.color
    if (this.description !== undefined && description !== this.description)
      description = this.description
    if (this.createAt !== undefined && createAt !== this.createAt)
      createAt = this.createAt
    // if (this.cards !== undefined && cards !== this.cards)
    // cards = this.cards

    return { id, name, color, description, createAt, cards }
  }

  setAll(data) {
    const { id, name, color, description, createAt, cards } = data

    this.id = id
    this.name = name
    this.color = color
    this.description = description
    this.createAt = createAt
    this.cards = cards
  }

  getAll() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      description: this.description,
      createAt: this.createAt,
      cards: this.cards
    }
  }
}
