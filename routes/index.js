const router = require("express").Router();
const userRouter = require("./users");
const clothingitemsRouter = require("./clothingitems");
const { STATUS_CODES } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", clothingitemsRouter);

// 404 handler
router.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
// This code defines the main router for the Express application. It sets up public routes for user authentication (login and signup) and protected routes for user and clothing item management. The router also includes a 404 handler for undefined routes. The clothing items and user routers are imported from separate files, allowing for modular organization of the code.
// The public routes are accessible to all users, while the protected routes require authentication. The router uses the STATUS_CODES utility to send appropriate HTTP status codes in the responses. The code is structured to handle errors gracefully and provide meaningful feedback to the client.
// The clothing items and user routers are imported from separate files, allowing for modular organization of the code. The public routes are accessible to all users, while the protected routes require authentication. The router uses the STATUS_CODES utility to send appropriate HTTP status codes in the responses. The code is structured to handle errors gracefully and provide meaningful feedback to the client.
// The clothing items and user routers are imported from separate files, allowing for modular organization of the code. The public routes are accessible to all users, while the protected routes require authentication. The router uses the STATUS_CODES utility to send appropriate HTTP status codes in the responses. The code is structured to handle errors gracefully and provide meaningful feedback to the client.
// The clothing items and user routers are imported from separate files, allowing for modular organization of the code. The public routes are accessible to all users, while the protected routes require authentication. The router uses the STATUS_CODES utility to send appropriate HTTP status codes in the responses. The code is structured to handle errors gracefully and provide meaningful feedback to the client.
