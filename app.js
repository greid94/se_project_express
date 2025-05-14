const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

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
app.use("/", mainRouter); // if requests are sent to root, then send them to the userRouter

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
