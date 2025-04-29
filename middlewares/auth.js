const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const statusCodes = require("../utils/errors");

// Middleware to authenticate user using JWT.This code defines an
// `auth` middleware function for an Express.js application.
//  The purpose of this middleware is to authenticate incoming requests
//  by verifying a JSON Web Token (JWT) provided in the
// `Authorization` header. If the token is valid, the middlew
// are allows the request to proceed to the next handler; otherwise, it
//  responds with an error.

const auth = (req, res, next) => {
  try {
    // Check if the Authorization header is present and starts with "Bearer "
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(statusCodes.UNAUTHORIZED_ERROR)
        .send({ message: "Authorization required" });
    }

    // Extract the token from the Authorization header
    const token = authorization.replace("Bearer ", "");

    // Verify the JWT using the secret key
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    return next();
  } catch (err) {
    return res
      .status(statusCodes.UNAUTHORIZED_ERROR)
      .send({ message: "Authorization required" });
  }
};

module.exports = auth;
