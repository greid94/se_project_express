const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdatingUser } = require("../middlewares/validation");

// Auth middleware
router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdatingUser, updateProfile);

module.exports = router;
