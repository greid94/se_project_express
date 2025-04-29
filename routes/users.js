const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Get current user route
router.get("/me", auth, getCurrentUser);

// Update user route
router.patch("/me", auth, updateUser);

module.exports = router;
