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
router.post("/", createItem, validateClothingItem); // Create
router.put("/:id/likes", likeItem, validateItemId); // Update

router.delete("/:id/likes", unlikeItem, validateItemId);
router.delete("/:id", deleteItem, validateItemId);

module.exports = router;
