import type { Request, Response, NextFunction } from "express";
import type { ZodError } from "zod";
import { ValidationError } from "../lib/error-handler";

/**
 * Validation middleware factory
 * Validates request body, query, or params against Zod schema
 */
export const validate = (schema: any) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const result = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = result.body;
            req.query = result.query;
            req.params = result.params;
            next();
        } catch (error) {
            if (error instanceof Error && error.name === "ZodError") {
                const zodError = error as ZodError;
                const errorMessages = zodError.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                }));

                next(
                    new ValidationError(
                        `Validation failed: ${errorMessages.map((e) => `${e.path}: ${e.message}`).join(", ")}`,
                    ),
                );
            } else {
                next(error);
            }
        }
    };
};

/**
 * Validate only request body
 */
export const validateBody = (schema: any) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            console.log("=== Validating request body ===");
            console.log("Body before validation:", JSON.stringify(req.body, null, 2));
            console.log("Schema name:", schema?._def?.description || "Unknown schema");

            req.body = await schema.parseAsync(req.body);

            console.log("Body after validation:", JSON.stringify(req.body, null, 2));
            console.log("=== Validation successful ===");
            next();
        } catch (error) {
            console.log("=== Validation failed ===");
            console.log("Error:", error);

            if (error instanceof Error && error.name === "ZodError") {
                const zodError = error as ZodError;
                console.log("Zod errors:", JSON.stringify(zodError.errors, null, 2));

                const errorMessages = zodError.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                }));

                next(
                    new ValidationError(
                        `Validation failed: ${errorMessages.map((e) => `${e.path}: ${e.message}`).join(", ")}`,
                    ),
                );
            } else {
                next(error);
            }
        }
    };
};

/**
 * Validate only query parameters
 */
export const validateQuery = (schema: any) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.query = await schema.parseAsync(req.query);
            next();
        } catch (error) {
            if (error instanceof Error && error.name === "ZodError") {
                const zodError = error as ZodError;
                const errorMessages = zodError.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                }));

                next(
                    new ValidationError(
                        `Validation failed: ${errorMessages.map((e) => `${e.path}: ${e.message}`).join(", ")}`,
                    ),
                );
            } else {
                next(error);
            }
        }
    };
};

/**
 * Validate only route parameters
 */
export const validateParams = (schema: any) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.params = await schema.parseAsync(req.params);
            next();
        } catch (error) {
            if (error instanceof Error && error.name === "ZodError") {
                const zodError = error as ZodError;
                const errorMessages = zodError.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                }));

                next(
                    new ValidationError(
                        `Validation failed: ${errorMessages.map((e) => `${e.path}: ${e.message}`).join(", ")}`,
                    ),
                );
            } else {
                next(error);
            }
        }
    };
};
