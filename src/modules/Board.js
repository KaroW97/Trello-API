module.exports = class Board {
  constructor() {
    /*** @type {string}*/
    this.id = undefined

    /*** @type {string}*/
    this.name = undefined

    /*** @type {string}*/
    this.color = undefined

    /*** @type {string}*/
    this.description = undefined

    /*** @type {Date}*/
    this.createAt = undefined

    /*** @type {Record<string, string | string[] | number | Date}*/
    this.cards = undefined

    /*** @type {boolean}*/
    this.recordExists = true
  }

  /**
   * @param {string} id
   */
  setId(id) {
    this.id = id
  }

  getId() {
    return this.id
  }

  /**
   * Set false if record is not in DB
   */
  setRecordExists() {
    this.recordExists = false
  }

  /**
   * Return weather the record exists or not
   * @returns {boolean}
   */
  getRecordExists() {
    return this.recordExists
  }

  /**
   * Returns object with changed fields
   * @param {Record<string, string | Record<string,unknown>[] | number | Date} data
   * @returns {Record<string, string | Record<string, unknown>[] | number | Date}
   */
  compare(data) {
    let { id, name, color, description, createAt, cards } = data || {}

    if (this.name !== undefined && name !== this.name) name = this.name
    if (this.color !== undefined && color !== this.color) color = this.color
    if (this.description !== undefined && description !== this.description)
      description = this.description
    if (this.createAt !== undefined && createAt !== this.createAt)
      createAt = this.createAt
    if (this.cards !== undefined && !this.cards.length) cards = []

    return { id, name, color, description, createAt, cards }
  }

  /**
   * Set data for board
   * @param {Record<string, string | Record<string,unknown>[] | number | Date} data
   */
  setAll(data) {
    const { id, name, color, description, createAt, cards } = data

    this.id = id
    this.name = name
    this.color = color
    this.description = description
    this.createAt = createAt
    this.cards = cards
  }

  /**
   * Returns all values set for board
   * @returns {Record<string, string | Recor<string, unknown>[] | number | Date}
   */
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
