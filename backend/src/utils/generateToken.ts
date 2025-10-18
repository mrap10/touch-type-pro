import jwt from "jsonwebtoken";

export const generateToken = (userId: string, email: string, username: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(
        { 
            userId, 
            email, 
            name: username 
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: "14d",
            issuer: "touch-type-pro",
            audience: "touch-type-pro-users"
        }
    );
};

export const verifyToken = (token: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: "touch-type-pro",
        audience: "touch-type-pro-users"
    });
};