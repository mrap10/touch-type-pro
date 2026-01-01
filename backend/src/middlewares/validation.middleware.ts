import { Request, Response, NextFunction } from "express";
import { z, ZodType, ZodError } from "zod";

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {            
            const dataToValidate = {
                body: req.body,
                query: req.query,
                params: req.params
            };            
            const result = schema.parse(dataToValidate) as any;

            // schema already nests reqs, so we need to extract them
            if (result.body) {
                req.body = result.body;
            }

            (req as any).validated = {
                query: result.query ?? req.query,
                params: result.params ?? req.params,
            }
            
            next();
        } catch (error: unknown) {
            // Handle Zod errors specifically
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                
                return res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    details: formattedErrors
                });
            }
            
            // Handle unexpected errors
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                details: [{ field: "unknown", message: error instanceof Error ? error.message : "Unknown validation error" }]
            });
        }
    };
};

export const signupSchema = z.object({
    body: z.object({
        username: z.string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must not exceed 30 characters")
            .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscore and hyphen"),
        email: z.string()
            .email("Invalid email format")
            .transform((val) => val.toLowerCase()),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase, one lowercase, and one number")
    })
});

export const signinSchema = z.object({
    body: z.object({
        email: z.string()
            .email("Invalid email format")
            .transform((val) => val.toLowerCase()),
        password: z.string().min(1, "Password is required")
    })
});

export const saveLessonProgressSchema = z.object({
    body: z.object({
        lessonId: z.string()
            .min(1, "Lesson ID is required")
            .max(100, "Lesson ID is too long"),
        mode: z.enum(["NORMAL", "DEV"]).optional(),
        accuracy: z.number()
            .min(0, "Accuracy must be between 0 and 100")
            .max(100, "Accuracy must be between 0 and 100")
            .optional(),
        wpm: z.number()
            .min(0, "WPM must be a positive number")
            .max(500, "WPM seems unrealistic")
            .int("WPM must be an integer")
            .optional(),
        star: z.number()
            .min(0, "Stars must be between 0 and 3")
            .max(3, "Stars must be between 0 and 3")
            .int("Stars must be an integer")
            .default(0),
        focusKeys: z.array(z.string())
            .max(50, "Too many focus keys")
            .default([]),
        errorPatterns: z.optional(z.array(z.string()))
    })
});

export const getLessonProgressSchema = z.object({
    params: z.object({
        lessonId: z.string().min(1, "Lesson ID is required")
    })
});