const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { STATUS_CODES } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header is present and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  // Extract token from authorization header
  const token = authorization.replace("Bearer ", "");

  try {
    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Add payload to request object
    req.user = payload;

    // Call next middleware
    return next();
  } catch (err) {
    // If token is invalid, send unauthorized response
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: "Invalid token" });
  }
};

module.exports = auth;
