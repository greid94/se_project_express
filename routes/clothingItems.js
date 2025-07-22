const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateItemId,
} = require("../middlewares/validation");
const {
  createItem,
  getItems,
  likeItem,
  unlikeItem,
  deleteItem,
} = require("../controllers/clothingItems");

// Public routes
router.get("/", getItems); // Read

// Auth middleware
router.use(auth);

// Protected routes
router.post("/", validateClothingItem, createItem); // Create
router.put("/:itemId", validateItemId, likeItem); // Update

router.delete("/:id/likes", validateItemId, unlikeItem);
router.delete("/:id", validateItemId, deleteItem);

module.exports = router;
