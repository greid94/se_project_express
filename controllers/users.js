const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { STATUS_CODES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../custom_errors/BadRequestError");
const ConflictError = require("../custom_errors/ConflictError");
const NotFoundError = require("../custom_errors/NotFoundError");
const InternalServerError = require("../custom_errors/InternalServerError");
const UNAUTHORIZED = require("../custom_errors/UnauthorizedError");
// POST
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(STATUS_CODES.CREATED).send(userObject);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        const invalidFields = Object.keys(err.errors).join(", ");
        return next(
          new BadRequestError({
            message: `Invalid data - The following fields are required: ${invalidFields}`,
          })
        );
      }
      if (err.code === 11000) {
        return next(
          new ConflictError({
            message:
              "An account with this email already exists- please use a different email",
          })
        );
      }
      return next(new { message: "An error occurred on the server" }());
    });
};

// GET
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(new InternalServerError("An error occurred on the server"));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new BadRequestError("Email and password are required for login")
    );
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UNAUTHORIZED("Incorrect email or password"));
      }
      return next(new InternalServerError("An error occurred on the server"));
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )

    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(STATUS_CODES.OK).send(userObject);
    })
    // If the user is not found, return a 404 error
    // If the user ID is invalid, return a 400 error
    // If the request is successful, return the updated user object
    // If there is a server error, return a 500 error

    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        const invalidFields = Object.keys(err.errors).join(", ");
        return next(
          new BadRequestError({
            message: `Invalid data - The following fields are required: ${invalidFields}`,
          })
        );
      }
      return next(new InternalServerError("An error occurred on the server"));
    });
};
// Export the functions to be used in other files
module.exports = { createUser, getCurrentUser, login, updateProfile };
