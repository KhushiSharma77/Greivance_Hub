import { Router } from "express";
import { authLimiter } from "../../middleware/rate-limit";
import { asyncHandler } from "../../lib/error-handler";
import { validateBody } from "../../middleware/validate";
import { signupSchema, loginSchema } from "../../types/auth.types";
import * as authService from "../../services/auth.service";
import * as otpService from "../../services/otp.service";

const authRouter: Router = Router();

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new citizen (unverified)
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
            message: "Citizen registered successfully. Please verify your email.",
        });
    }),
);

/**
 * @route   POST /api/v1/auth/send-otp
 * @desc    Send OTP to email for verification
 * @access  Public
 */
authRouter.post(
    "/send-otp",
    authLimiter,
    asyncHandler(async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const previewUrl = await otpService.sendEmailOTP(email);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            previewUrl, // Ethereal test email preview link (null in production)
        });
    }),
);

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify OTP and mark user as verified
 * @access  Public
 */
authRouter.post(
    "/verify-otp",
    authLimiter,
    asyncHandler(async (req, res) => {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        await otpService.verifyOTP(email, otp);

        // Mark user as verified in DB
        await authService.markUserVerified(email);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
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
