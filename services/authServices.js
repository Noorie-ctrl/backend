import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import jwtConfig from "../config/jwtConfig.js";

// Register new user
export const registerUserService = async (name, email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  if (!jwtConfig.secret) throw new Error("JWT secret is not set!");
  console.log("JWT_SECRET in authServices:", jwtConfig.secret);

  const token = jwt.sign(
    { id: user.id, email: user.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};

// Login existing user
export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  if (!jwtConfig.secret) throw new Error("JWT secret is not set!");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};

// Get user details (protected route)
export const getUserDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) return { message: "User not found" };
  return user;
};
