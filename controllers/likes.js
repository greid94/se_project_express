const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { STATUS_CODES } = require("../utils/constants");

const likeItem = (req, res) => {
  const { _id: userId } = req.user;
  console.log("User ID:", req.user?._id);
  const { itemId } = req.params;
  console.log("Received item ID:", itemId);

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    console.error("Invalid item ID format:", itemId);
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    { new: true }
  )
    .orFail(() => {
      throw Object.assign(new Error("Item not found"), {
        statusCode: STATUS_CODES.NOT_FOUND,
      });
    })
    .then((item) => {
      if (!item) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      console.log("Item liked successfully:", item);
      return res.status(STATUS_CODES.OK).send({ data: item });
    })
    .catch((err) => {
      console.error("Error liking item:", err);
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      if (err.statusCode === STATUS_CODES.NOT_FOUND) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};

const dislikeItem = (req, res) => {
  const { _id: userId } = req.user;
  console.log("User ID:", req.user?._id);
  const { itemId } = req.params;
  console.log("Received item ID:", itemId);

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    console.error("Invalid item ID format:", itemId);
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        console.error("Item not found:", itemId);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      console.log("Item disliked successfully:", item);
      return res.status(STATUS_CODES.OK).send({ data: item });
    })
    .catch((err) => {
      console.error("Error disliking item", err);
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "invalid item ID format" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "internal server error" });
    });
};

module.exports = { likeItem, dislikeItem };
