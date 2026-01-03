// import type { Request, Response, NextFunction } from "express";
// import type { ZodError } from "zod";
// import { ValidationError } from "../lib/error-handler";

// /**
//  * Validation middleware factory
//  * Validates request body, query, or params against Zod schema
//  */
// export const validate = (schema: any) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await schema.parseAsync({
//                 body: req.body,
//                 query: req.query,
//                 params: req.params,
//             });
//             next();
//         } catch (error) {
//             if (error instanceof Error && error.name === "ZodError") {
//                 const zodError = error as ZodError;
//                 const errorMessages = zodError.errors.map((err) => ({
//                     path: err.path.join("."),
//                     message: err.message,
//                 }));

//                 next(
//                     new ValidationError(
//                         `Validation failed: ${errorMessages.map((e) => `${e.path}: ${e.message}`).join(", ")}`,
//                     ),
//                 );
//             } else {
//                 next(error);
//             }
//         }
//     };
// };

// /**
//  * Validate only request body
//  */
// export const validateBody = (schema: any) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await schema.parseAsync(req.body);
//             next();
//         } catch (error) {
//             if (error instanceof Error && error.name === "ZodError") {
//                 const zodError = error as ZodError;
//                 const errorMessages = zodError.errors.map((err) => ({
//                     path: err.path.join("."),
//                     message: err.message,
//                 }));

//                 next(
//                     new ValidationError(
//                         `Validation failed: ${errorMessages.map((e) => `${e.path}: ${e.message}`).join(", ")}`,
//                     ),
//                 );
//             } else {
//                 next(error);
//             }
//         }
//     };
// };

// /**
//  * Validate only query parameters
//  */
// export const validateQuery = (schema: any) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await schema.parseAsync(req.query);
//             next();
//         } catch (error) {
//             if (error instanceof Error && error.name === "ZodError") {
//                 const zodError = error as ZodError;
//                 const errorMessages = zodError.errors.map((err) => ({
//                     path: err.path.join("."),
//                     message: err.message,
//                 }));

//                 next(
//                     new ValidationError(
//                         `Validation failed: ${errorMessages.map((e) => `${e.path}: ${e.message}`).join(", ")}`,
//                     ),
//                 );
//             } else {
//                 next(error);
//             }
//         }
//     };
// };

// /**
//  * Validate only route parameters
//  */
// export const validateParams = (schema: any) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await schema.parseAsync(req.params);
//             next();
//         } catch (error) {
//             if (error instanceof Error && error.name === "ZodError") {
//                 const zodError = error as ZodError;
//                 const errorMessages = zodError.errors.map((err) => ({
//                     path: err.path.join("."),
//                     message: err.message,
//                 }));

//                 next(
//                     new ValidationError(
//                         `Validation failed: ${errorMessages.map((e) => `${e.path}: ${e.message}`).join(", ")}`,
//                     ),
//                 );
//             } else {
//                 next(error);
//             }
//         }
//     };
// };
