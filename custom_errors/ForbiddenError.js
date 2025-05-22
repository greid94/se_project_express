class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403; // HTTP status code for Forbidden
  }
}
module.exports = ForbiddenError;
// This module exports a ForbiddenError class that extends the built-in Error class.
