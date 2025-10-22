import { Router } from "express";
import { getUserProfile, registerUser, signInController } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { validate, signinSchema, signupSchema } from "../middlewares/validation.middleware";
import { authLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/signup", authLimiter, validate(signupSchema), registerUser);
router.post("/signin", authLimiter, validate(signinSchema), signInController);
router.get("/profile", verifyToken, getUserProfile);

export default router;