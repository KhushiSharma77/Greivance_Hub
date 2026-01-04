import { Router } from "express";
import { authLimiter } from "../../middleware/rate-limit";
import { asyncHandler } from "../../lib/error-handler";
import { validateBody } from "../../middleware/validate";
import { signupSchema, loginSchema } from "../../types/auth.types";
import * as authService from "../../services/auth.service";

const authRouter: Router = Router();

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new citizen
 * @access  Public
 */
authRouter.post(
    "/signup",
    authLimiter,
    validateBody(signupSchema),
    asyncHandler(async (req, res) => {
        await authService.signupCitizen(req.body);

        res.status(201).json({
            success: true,
            message: "Citizen registered successfully",
        });
    }),
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user (citizen, officer, or admin)
 * @access  Public
 */
authRouter.post(
    "/login",
    authLimiter,
    validateBody(loginSchema),
    asyncHandler(async (req, res) => {
        const result = await authService.login(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }),
);

export default authRouter;
