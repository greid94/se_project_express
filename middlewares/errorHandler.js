const errorHandler = (err, req, res, next) => {
  console.error(err);
  // Check if the error is a validation error
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An error has occurred on the server" : message,
  });
};
module.exports = errorHandler;
