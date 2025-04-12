const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const likeRouter = require("./likes");
const { STATUS_CODES } = require("../utils/constants");

router.use("/users", userRouter);
router.use("/items/:itemId/likes", likeRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
