import express from "express";
import { registerUser, login, getUserDetailsController } from "../controllers/authController.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post("/register", 
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
            next();
        },
    registerUser
);


router.post("/login", 
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    },
    login
);


router.get("/me", getUserDetailsController )

export default router;
