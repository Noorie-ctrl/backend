import express from "express";
import { registerUser, login, getUserDetailsController } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", registerUser)
router.post("/login", login)
router.get("/me", getUserDetailsController )

export default router;
