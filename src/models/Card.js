module.exports = class Card {
  constructor() {
    /*** @type {string}*/
    this.id = undefined

    /*** @type {string}*/
    this.name = undefined

    /*** @type {string}*/
    this.description = undefined

    /*** @type {Date}*/
    this.createAt = undefined

    /*** @type {Date}*/
    this.estimate = undefined

    /*** @type {number}*/
    this.status = undefined

    /*** @type {Date}*/
    this.dueDate = undefined

    /*** @type {string[]}*/
    this.labels = []

    /*** @type {boolean}*/
    this.recordExists = true
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

  setId(id) {
    this.id = id
  }

  getId() {
    return this.id
  }

  /**
   * Set data for card
   * @param {Record<string, string | string[] | number | Date} data
   */
  setAll(data) {
    const {
      id,
      name,
      description,
      createAt,
      estimate,
      status,
      dueDate,
      labels
    } = data

    this.id = id
    this.name = name
    this.description = description
    this.createAt = createAt
    this.estimate = estimate
    this.status = status
    this.dueDate = dueDate
    this.labels = labels
  }

  /**
   * Returns all values set for board
   * @returns {Record<string, string | Recor<string, unknown>[] | number | Date>}
   */
  getAll() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createAt: this.createAt,
      estimate: this.estimate,
      status: this.status,
      dueDate: this.dueDate,
      labels: this.labels
    }
  }

  /**
   * Returns object with changed fields
   * @param {Record<string, string | string[] | number | Date>} data
   * @returns {Record<string, string | string[] | number | Date>}
   */
  compare(data) {
    let { id, name, description, createAt, estimate, status, dueDate, labels } =
      data

    if (this.name !== undefined && name !== this.name) name = this.name
    if (this.description !== undefined && description !== this.description)
      description = this.description
    if (this.createAt !== undefined && createAt !== this.createAt)
      createAt = this.createAt
    if (this.estimate !== undefined && estimate !== this.estimate)
      estimate = this.estimate
    if (this.status !== undefined && status !== this.status)
      status = this.status
    if (this.dueDate !== undefined && dueDate !== this.dueDate)
      dueDate = this.dueDate
    if (this.labels !== undefined && labels !== this.labels) {
      const noRepeat = this.labels.filter((label) => !labels.includes(label))

      labels = [...labels, ...noRepeat]
    }
    if (this.labels !== undefined && !this.labels.length) labels = []

    return {
      id,
      name,
      description,
      createAt,
      estimate,
      status,
      dueDate,
      labels
    }
  }
}
