const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  likeItem,
  unlikeItem,
  deleteItem,
} = require("../controllers/clothingitems");

// Public routes
router.get("/", getItems); // Read

// Auth middleware
router.use(auth);

// Protected routes
router.post("/", createItem); // Create
router.put("/:id/likes", likeItem); // Update

router.delete("/:id/likes", unlikeItem);
router.delete("/:id", deleteItem);

module.exports = router;
