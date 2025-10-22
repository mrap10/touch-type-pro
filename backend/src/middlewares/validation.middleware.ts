import { Request, Response, NextFunction } from "express";
import { z, ZodType } from "zod";

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
            req.body = result.body || req.body;
            req.query = result.query || req.query;
            req.params = result.params || req.params;
            
            next();
        } catch (error: any) {            
            const zodIssues = error.issues || error.errors || [];     

            const formattedErrors = zodIssues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message
            }));
            
            const errorMessage = formattedErrors.length > 0 
                ? `Validation failed: ${formattedErrors.map((e: any) => e.message).join(', ')}`
                : "Validation failed";
            
            return res.status(400).json({
                success: false,
                error: errorMessage,
                details: formattedErrors
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
        email: z.email("Invalid email format").toLowerCase(),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase, one lowercase, and one number")
    })
});

export const signinSchema = z.object({
    body: z.object({
        email: z.email("Invalid email format").toLowerCase(),
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