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
router.put("/:itemId/likes", validateItemId, likeItem); // Update

router.delete("/:itemId/likes", validateItemId, unlikeItem);
router.delete("/:itemId", validateItemId, deleteItem);

module.exports = router;
