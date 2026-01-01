import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma-client";

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Internal server error";
    let details: any = undefined;

    // Handle Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch ((err as Prisma.PrismaClientKnownRequestError).code) {
            case "P2002":
                statusCode = 409;
                message = "A record with this value already exists";
                details = { field: (err as Prisma.PrismaClientKnownRequestError).meta?.target };
                break;
            case "P2025":
                statusCode = 404;
                message = "Record not found";
                break;
            case "P2003":
                statusCode = 400;
                message = "Foreign key constraint failed";
                break;
            default:
                statusCode = 400;
                message = "Database operation failed";
        }
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid data provided";
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    if (process.env.NODE_ENV === "development") {
        console.error("Error:", {
            message: err.message,
            stack: err.stack,
            statusCode
        });
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};

// asyncHandler wrapper to better catch errors
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};