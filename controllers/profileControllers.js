// controllers/profileController.js
export const updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  try {
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { name, email } }),
      // ... other operations that must be atomic
    ]);

    const { password, ...safeUser } = updatedUser;
    res.json({ message: "Profile updated", user: safeUser });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ message: "Email already in use" });
    next(err);
  }
};
