import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

/**
 * General API rate limiter
 * Limits: 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        error: {
            message: "Too many requests from this IP, please try again later.",
        },
    },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: {
                message: "Too many requests from this IP, please try again later.",
            },
        });
    },
});

/**
 * Strict rate limiter for authentication routes
 * Limits: 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    message: {
        success: false,
        error: {
            message:
                "Too many authentication attempts from this IP, please try again later.",
        },
    },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: {
                message:
                    "Too many authentication attempts from this IP, please try again later.",
            },
        });
    },
});

/**
 * Rate limiter for posting grievances
 * Limits: 20 requests per 15 minutes per IP
 */
export const grievanceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            message: "Too many grievance posts from this IP, please try again later.",
        },
    },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: {
                message:
                    "Too many create requests from this IP, please try again later.",
            },
        });
    },
});
