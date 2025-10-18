import { Router } from "express";
import { deleteProgress, getUserLessonProgress, getUserProgress, saveLessonProgress } from "../controllers/learn.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { validate, saveLessonProgressSchema, getLessonProgressSchema } from "../middlewares/validation.middleware";
import { progressLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/progress", verifyToken, progressLimiter, validate(saveLessonProgressSchema), saveLessonProgress);
router.get("/progress", verifyToken, getUserProgress);
router.get("/progress/:lessonId", verifyToken, validate(getLessonProgressSchema),getUserLessonProgress);
router.delete("/progress/:lessonId", verifyToken, validate(getLessonProgressSchema), deleteProgress);

export default router;