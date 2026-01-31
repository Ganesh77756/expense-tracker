import express from "express";
import { signup, login,getUserProfile, updateUserProfile,forgotPassword, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);


router.post("/forgot", forgotPassword);
router.post("/reset/:token", resetPassword);
console.log("Auth routes file loaded!");

export default router;