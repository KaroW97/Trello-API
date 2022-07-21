/**
 * When incorrect data provided
 */
class BadRequest extends Error {
  constructor(details) {
    super('BAD_REQUEST')
    this.status = 400
    this.name = 'BAD_REQUEST'
    this.message = details
  }
}

/**
 * No data for provided Id
 */
class NoDataFound extends BadRequest {
  constructor(filePath, isCard = false) {
    super(`No data for given ${isCard ? 'card ' : ''}id ${filePath}`)
  }
}

/**
 * File access error
 */
class FileError extends BadRequest {
  constructor(filePath) {
    super(`File couldn't be found under given path: ${filePath}`)
  }
}

/**
 * When file is empty
 */
class FileErrorEmpty extends BadRequest {
  constructor(filePath) {
    super(`File is empty: ${filePath}`)
  }
}

/**
 * Some error occurred during fetch
 */
class TransferError extends Error {
  constructor() {
    super('INTERNAL_ERROR')
    this.status = 500
    this.name = 'INTERNAL_ERROR'
    this.message = 'Error occurred during fetch'
  }
}

module.exports = {
  FileError,
  BadRequest,
  TransferError,
  FileErrorEmpty,
  NoDataFound
}
