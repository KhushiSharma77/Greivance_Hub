import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../lib/error-handler";
import { env } from "@team-call-of-code/env/server";


export interface JWTPayload {
    id: string;
    role: "citizen" | "officer" | "admin";
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("No token provided");
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        // TODO: Replace 'your-secret-key' with actual JWT secret from env
        const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

        // Attach user to request
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError("Invalid token"));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(new UnauthorizedError("Token expired"));
        } else {
            next(error);
        }
    }
};