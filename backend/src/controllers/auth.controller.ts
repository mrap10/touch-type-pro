import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { AppError, asyncHandler } from "../middlewares/errorHandler.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email.toLowerCase() },
                { username }
            ]
        }
    });

    if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
            throw new AppError("Email already registered", 409);
        }
        if (existingUser.username === username) {
            throw new AppError("Username already taken", 409);
        }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
        data: {
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            lastLogin: new Date()
        },
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            lastLogin: true
        }
    });

    const token = generateToken(newUser.id, newUser.email, newUser.username);

    res.status(201).json({ 
        success: true,
        message: "User registered successfully",
        data: {
            user: newUser,
            token
        }
    });
});

export const signInController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid credentials", 401);
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
    });

    const token = generateToken(user.id, user.email, user.username);

    res.status(200).json({ 
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            },
            token
        }
    });
});

export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError("User not authenticated", 401);
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            lastLogin: true,
            progress: {
                select: {
                    lessonId: true,
                    mode: true,
                    star: true,
                    accuracy: true,
                    wpm: true,
                    updatedAt: true
                },
                orderBy: {
                    updatedAt: 'desc'
                },
                take: 10 // only return recent 10 lessons
            }
        }
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    res.status(200).json({ 
        success: true,
        data: user 
    });
});