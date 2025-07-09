const { JWT_SECRET = "dev" } = process.env;
// This should be stored in an environment variable in a real application
// and not hardcoded in the source code
module.exports = { JWT_SECRET };
