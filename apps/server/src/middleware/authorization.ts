import type { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../lib/error-handler";

type UserRole = "citizen" | "officer" | "admin";

/**
 * Authorization middleware factory
 * Checks if user has required role(s)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedError("Authentication required"));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new ForbiddenError(
                    `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
                ),
            );
        }

        next();
    };
};

/**
 * Check if user is citizen
 */
export const isCitizen = authorize("citizen");

/**
 * Check if user is officer
 */
export const isOfficer = authorize("officer");

/**
 * Check if user is admin
 */
export const isAdmin = authorize("admin");