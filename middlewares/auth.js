const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { STATUS_CODES } = require("../utils/errors");

const auth = (req, res, next) => {
  // Get authorization from header
  const { authorization } = req.headers;

  // Check if authorization header exists
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  // Get token from authorization header
  const token = authorization.replace("Bearer ", "");

  try {
    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Add payload to request object
    req.user = payload;

    // Move to next middleware
    return next();
  } catch (err) {
    // Handle token verification errors
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: "Invalid token" });
  }
};

module.exports = auth;
