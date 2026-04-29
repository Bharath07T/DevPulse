import { body } from 'express-validator';

export const registerValidation = [
    body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min : 3 }).withMessage("Username must be atleast 3 characters")
    .isLength({ max : 30 }).withMessage("Username cannot exceed 30 characters"),

    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

    body("password")
    .notEmpty().withMessage("password is required")
    .isLength({ min : 6 }).withMessage("Password must be atleast 6 characters")
];

export const loginValidation = [
    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

    body("password")
    .notEmpty().withMessage("Password is required")
];