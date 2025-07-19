const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../custom_errors/UnauthorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header is present and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError("Authorization header is missing or invalid")
    );
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
    return next(new UnauthorizedError("Authentication failed"));
  }
};

module.exports = auth;
