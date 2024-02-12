import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import validatedToken from "./../middleware/validatedTokenHandler.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(validatedToken, getUserProfile)
  .put(validatedToken, updateUserProfile);

export default router;
