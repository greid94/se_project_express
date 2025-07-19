class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}
module.exports = UnauthorizedError;
// This module exports an UnauthorizedError class that extends the built-in Error class.
