import express from "express";
import prisma from "../config/db.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { updateProfile } from "../controllers/profileControllers.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/profile - Return current user's profile
router.get("/profile", async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard - Return dashboard data
router.get("/dashboard", async (req, res, next) => {
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: req.user.id },
    });

    res.json({
      message: `Welcome back, ${req.user.name}!`,
      totalPosts: userPosts.length,
      posts: userPosts,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/profile - Update user profile
router.put("/profile", updateProfile);

export default router;
