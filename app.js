const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Importing routers
const itemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");

const auth = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users");
const { NOT_FOUND } = require("./utils/errors");

const app = express();
// Middleware to parse JSON and URL-encoded data
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Enable CORS

app.use(cors());
// Signup route
app.post("/signup", createUser);

// Signin route
app.post("/signin", login);

// Mounting routers

app.use("/users", usersRouter);

// Middleware to protect routes
app.use(
  "/items",
  (req, res, next) => {
    if (req.method === "GET") {
      return next();
    }
    return auth(req, res, next);
  },
  itemsRouter
);

// Environment variable for the port

const { PORT = 3001 } = process.env;

// Connecting to MongoDB

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// Middleware for handling 404 Not Found

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Error handling middleware

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
  next(err);
});

// starts express server

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
