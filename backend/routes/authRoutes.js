const express = require('express');
const router = express.Router();
const { userSignup, userLogin, getCurrentUser, updateProfile, logout } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/me", verifyToken, getCurrentUser);
router.patch("/profile", verifyToken, updateProfile);
router.post("/logout", logout);

module.exports = router;
