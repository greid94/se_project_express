const ClothingItem = require("../models/clothingitems");
const { STATUS_CODES } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  // console.log("object", name, weather, imageUrl);
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((items) => res.status(STATUS_CODES.CREATED).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(STATUS_CODES.BAD_REQUEST).send({
          message:
            "Invalid data - please ensure all required fields are filled in",
        });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" }); // General "catch all" catch block
    });
};

const likeItem = (req, res) => {
  // console.log("check", req.user._id);
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findById(req.params.id)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        const error = new Error("Forbidden");
        error.statusCode = STATUS_CODES.FORBIDDEN;
        return Promise.reject(error);
      }
      return ClothingItem.findByIdAndDelete(req.params.id);
    })
    .then((deletedItem) => res.send({ deletedItem }))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === STATUS_CODES.FORBIDDEN) {
        return res
          .status(STATUS_CODES.FORBIDDEN)
          .send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = { createItem, getItems, likeItem, unlikeItem, deleteItem };
