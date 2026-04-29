import { Router } from 'express';
import protectMiddleware from '../middlewares/protectMiddleware.js';
import validate from '../middlewares/validate.js';
import { registerValidation, loginValidation } from '../validations/userValidation.js';
import { loginUser, registerUser, getUserProfile } from '../controllers/authController.js';

const router = Router();

router.post("/register", registerValidation, validate, registerUser); // Sign up (new Registration)
router.post("/login", loginValidation, validate, loginUser); // Login 
router.get("/me", protectMiddleware, getUserProfile); // get Profile

export default router;