const express = require("express");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const cors = require("cors");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

const { PORT = 3001 } = process.env;

// connect to the MongoDB server
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error); // .catch((e) => console.error(e)); is an equivilent expression

app.use(cors());
app.use(express.json()); // middleware: put before router
app.use(requestLogger); // request logger
app.use("/", mainRouter);
app.use(errorLogger); // error logger
app.use(errors()); // celebrate error handler
app.use(errorHandler); //centralized error handler
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
