module.exports = class Card {
  constructor() {
    this.id = undefined
    this.name = undefined
    this.description = undefined
    this.createAt = undefined
    this.estimate = undefined
    this.status = undefined
    this.dueDate = undefined
    this.labels = []
    this.recordExists = true
  }

  setRecordExists() {
    this.recordExists = false
  }

  getRecordExists() {
    return this.recordExists
  }

  setId(id) {
    this.id = id
  }

  getId() {
    return this.id
  }

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
    if (this.labels !== undefined && labels !== this.labels)
      labels = this.labels

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
