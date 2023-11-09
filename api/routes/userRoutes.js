const express = require("express");
const {
  getAddresses,
  saveAddresses,
  verifyEmail,
  getUser,
  login,
  register,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/register").post(register);
router.route("/getUser").get(protect, getUser);
router.route("/verify/:token").get(verifyEmail);
router.route("/login").post(login);
router
  .route("/addresses")
  .post(protect, saveAddresses)
  .get(protect, getAddresses);

module.exports = router;
