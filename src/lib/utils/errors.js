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
 * No data for provided Id
 */
class NotFound extends Error {
  constructor() {
    super('NOT_FOUND')
    this.status = 404
    this.name = 'NOT_FOUND'
    this.message = 'Page could not be found'
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

class AccessDenied extends Error {
  constructor() {
    super('FORBIDDEN')
    this.status = 403
    this.name = 'FORBIDDEN'
    this.message = 'Access denied'
  }
}

module.exports = {
  FileError,
  BadRequest,
  TransferError,
  FileErrorEmpty,
  NoDataFound,
  NotFound,
  AccessDenied
}
