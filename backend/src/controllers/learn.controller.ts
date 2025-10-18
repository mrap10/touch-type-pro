import { Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";
import { AppError, asyncHandler } from "../middlewares/errorHandler.middleware";

export const saveLessonProgress = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { lessonId, accuracy, wpm, focusKeys, star, mode, errorPatterns } = req.body;

    if (!req.user?.id) {
        throw new AppError("User not authenticated", 401);
    }

    const existingProgress = await prisma.lessonProgress.findUnique({
        where: {
            userId_lessonId: {
                userId: req.user.id,
                lessonId
            }
        }
    });

    // Only update if new performance is better or equal
    const shouldUpdate = !existingProgress || 
        (star !== undefined && star > existingProgress.star) ||
        (accuracy !== undefined && accuracy > (existingProgress.accuracy || 0)) ||
        (wpm !== undefined && wpm > (existingProgress.wpm || 0));

    const progress = await prisma.lessonProgress.upsert({
        where: {
            userId_lessonId: {
                userId: req.user.id,
                lessonId
            }
        },
        update: shouldUpdate ? {
            ...(accuracy !== undefined && { accuracy }),
            ...(wpm !== undefined && { wpm }),
            ...(focusKeys && { focusKeys }),
            ...(star !== undefined && { star }),
            ...(errorPatterns && { errorPatterns }),
            updatedAt: new Date(),
        } : {
            ...(errorPatterns && { errorPatterns }),
            updatedAt: new Date(),
        },
        create: {
            userId: req.user.id,
            lessonId,
            accuracy: accuracy || null,
            wpm: wpm || null,
            focusKeys: focusKeys || [],
            star: star || 0,
            mode: mode || "NORMAL",
            errorPatterns: errorPatterns || null,
        },
        select: {
            id: true,
            lessonId: true,
            mode: true,
            star: true,
            accuracy: true,
            wpm: true,
            focusKeys: true,
            updatedAt: true,
        }
    });

    res.status(200).json({
        success: true,
        message: shouldUpdate ? "Progress saved successfully" : "Progress logged",
        data: progress
    });
});

export const getUserLessonProgress = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { lessonId } = req.params;

    if (!req.user?.id) {
        throw new AppError("User not authenticated", 401);
    }

    const progress = await prisma.lessonProgress.findUnique({
        where: {
            userId_lessonId: {
                userId: req.user.id,
                lessonId: lessonId
            }
        },
        select: {
            id: true,
            lessonId: true,
            mode: true,
            star: true,
            accuracy: true,
            wpm: true,
            focusKeys: true,
            updatedAt: true,
        }
    });

    if (!progress) {
        return res.status(200).json({
            success: true,
            data: null,
            message: "No progress found for this lesson"
        });
    }

    res.status(200).json({
        success: true,
        data: progress
    });
});

export const getUserProgress = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
        throw new AppError("User not authenticated", 401);
    }

    // query params for filtering
    const { mode, minStars } = req.query;

    const progress = await prisma.lessonProgress.findMany({
        where: {
            userId: req.user.id,
            ...(mode && { mode: mode as "NORMAL" | "DEV" }),
            ...(minStars && { star: { gte: parseInt(minStars as string) } })
        },
        select: {
            id: true,
            lessonId: true,
            mode: true,
            star: true,
            accuracy: true,
            wpm: true,
            focusKeys: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    const stats = {
        totalLessons: progress.length,
        averageAccuracy: progress.length > 0 
            ? progress.reduce((acc, p) => acc + (p.accuracy || 0), 0) / progress.length 
            : 0,
        averageWpm: progress.length > 0 
            ? progress.reduce((acc, p) => acc + (p.wpm || 0), 0) / progress.length 
            : 0,
        totalStars: progress.reduce((acc, p) => acc + p.star, 0),
        completedLessons: progress.filter(p => p.star >= 1).length
    };

    res.status(200).json({
        success: true,
        data: progress,
        stats
    });
});

export const deleteProgress = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { lessonId } = req.params;

    if (!req.user?.id) {
        throw new AppError("User not authenticated", 401);
    }

    const progress = await prisma.lessonProgress.findUnique({
        where: {
            userId_lessonId: {
                userId: req.user.id,
                lessonId
            }
        }
    });

    if (!progress) {
        throw new AppError("Progress not found", 404);
    }

    await prisma.lessonProgress.delete({
        where: {
            userId_lessonId: {
                userId: req.user.id,
                lessonId
            }
        }
    });

    res.status(200).json({
        success: true,
        message: "Progress deleted successfully"
    });
});