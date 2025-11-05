import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import jwtConfig from "../config/jwtConfig.js";

export const registerUserService = async (name, email, password) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    // select: { id, name, email  },
  });
  console.log("Created user:", user);

  const token = jwt.sign(
    { id: user.id, email: user.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return { 
     user: {
     id: user.id,
     name: user.name,
     email: user.email
     },
    token 

  };
};

export const loginUser = async ({ email, username, password }) => {

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  
  const token = jwt.sign(
    { id: user.id, email: user.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email, username: user.username} };
};

export const getUserDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: 1 },
    select: { id: true, name: true, email: true},
    
  });
  console.log("Fetched user details:", user);
  if(!user){
    return ({message:"user not found"})
  } else{
    return user;
  }
}
