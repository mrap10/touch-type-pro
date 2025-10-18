import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.middleware";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("No token provided. Please authenticate.", 401);
        }

        const token = authHeader.split(" ")[1];

        if (!token || token === "null" || token === "undefined") {
            throw new AppError("Invalid token format", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
            issuer: "touch-type-pro",
            audience: "touch-type-pro-users"
        }) as {
            userId: string;
            email: string;
            name: string;
        };

        req.user = {
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name
        };

        next();
    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ 
                success: false,
                error: "Token has expired. Please login again." 
            });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ 
                success: false,
                error: "Invalid token. Please login again." 
            });
        }
        next(error);
    }
};