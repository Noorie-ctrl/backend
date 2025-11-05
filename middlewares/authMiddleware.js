import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig.js";
import prisma from "../config/db.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
    
  } catch (error) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired" });
    if (err.name === "JsonWebTokenError") return res.status(401).json({ message: "Invalid token" });
    next(err);
  }
};
