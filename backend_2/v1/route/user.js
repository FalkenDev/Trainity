import express from "express";
import userModel from "../models/userModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", userModel.loginUser);
router.post("/register", userModel.createUser);
router.get("/me", auth, userModel.getUserProfile);
router.put("/me", auth, userModel.updateUserProfile);
router.delete("/me", auth, userModel.deleteUserProfile);

export default router;
