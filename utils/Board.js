module.exports = class Board {
  constructor() {
    this.id = undefined
    this.name = undefined
    this.color = undefined
    this.description = undefined
    this.createAt = undefined
  }

  setId(id) {
    this.id = id
  }

  getId() {
    return this.id
  }

  setName(name) {
    this.name = name
  }

  getName() {
    return this.name
  }

  setColor(color) {
    this.color = color
  }

  getColor() {
    return this.color
  }

  setDescription(description) {
    this.description = description
  }

  getDescription() {
    return this.description
  }

  setCreateAt(createAt) {
    this.createAt = createAt
  }

  getCreateAt() {
    return this.description
  }

  compare(data) {
    let { id, name, color, description, createAt } = data || {}

    if (this.name !== undefined && name !== this.name) name = this.name
    if (this.color !== undefined && color !== this.color) color = this.color
    if (this.description !== undefined && description !== this.description)
      description = this.description
    if (this.createAt !== undefined && createAt !== this.createAt)
      createAt = this.createAt

    return { id, name, color, description, createAt }
  }

  setAll(data) {
    const { id, name, color, description, createAt } = data

    this.id = id
    this.name = name
    this.color = color
    this.description = description
    this.createAt = createAt
  }

  getAll() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      description: this.description,
      createAt: this.createAt
    }
  }
}
