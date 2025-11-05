import express from "express";
import prisma from "../config/db.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply middleware to all routes here
router.use(authenticateToken);

// GET /api/profile - Return current user's profile
router.get("/profile", async (req, res) => {
  try {
    res.json(req.user); // already fetched in middleware
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
});

// GET /api/dashboard - Return dashboard data
router.get("/dashboard", async (req, res) => {
  try {
    // Example: Fetch user’s posts, tasks, etc.
    const userPosts = await prisma.post.findMany({
      where: { userId: req.user.id },
    });

    res.json({
      message: `Welcome back, ${req.user.name}!`,
      totalPosts: userPosts.length,
      posts: userPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard data." });
  }
});

// PUT /api/profile - Update user profile
router.put("/profile", async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
    });

   const { password, ...safeUser } = updatedUser;

    res.json({
      message: "Profile updated successfully.",
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile." });
  }
});

export default router;
