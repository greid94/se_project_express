const BadRequestError = require("../custom_errors/BadRequestError");
const ForbiddenError = require("../custom_errors/ForbiddenError");
const NotFoundError = require("../custom_errors/NotFoundError");

const { STATUS_CODES } = require("../utils/errors");
const ClothingItem = require("../models/clothingItems");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      next(err); // Pass the error to the next middleware
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  // console.log("object", name, weather, imageUrl);
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Invalid data - please ensure all required fields are filled in"
          )
        );
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
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
        return next(new BadRequestError("Invalid item ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      return next(new ForbiddenError("An error has occurred on the server"));
    });
};

const unlikeItem = (req, res, next) => {
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
        return next(new BadRequestError("Invalid item ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      return next(new ForbiddenError("An error has occurred on the server"));
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.id)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        next(
          new ForbiddenError("You do not have permission to delete this item")
        );
        return Promise.reject(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      return ClothingItem.findByIdAndDelete(req.params.id);
    })
    .then((deletedItem) => res.send({ deletedItem }))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === STATUS_CODES.FORBIDDEN) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      return next(new ForbiddenError("An error has occurred on the server"));
    });
};

module.exports = { createItem, getItems, likeItem, unlikeItem, deleteItem };
