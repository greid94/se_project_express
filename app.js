const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log("DB Connection Error:", error);
  });

app.use((req, res, next) => {
  req.user = { _id: "67f9c7d8c7ce2dacbb8aaf59" };

  next();
});

app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
