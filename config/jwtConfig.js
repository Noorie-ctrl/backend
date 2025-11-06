// import dotenv from "dotenv";
// dotenv.config();
import 'dotenv/config';


export default {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || "1h", 
};

