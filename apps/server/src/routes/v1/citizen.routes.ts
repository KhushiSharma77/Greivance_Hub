import { Router } from "express";
import { authenticate } from "../../middleware/authentication";
import { isCitizen } from "../../middleware/authorization";
import { asyncHandler } from "../../lib/error-handler";
import { grievanceLimiter } from "../../middleware/rate-limit";
import { validateBody, validateParams } from "../../middleware/validate";
import {
    createGrievanceSchema,
    updateGrievanceSchema,
    grievanceIdSchema,
} from "../../types/grievance.types";
import * as grievanceService from "../../services/grievance.service";

const citizenRouter: Router = Router();

// All citizen routes require authentication
citizenRouter.use(authenticate);
citizenRouter.use(isCitizen);

/**
 * @route   POST /api/v1/citizen/grievances
 * @desc    Create a new grievance
 * @access  Private (Citizen)
 */
citizenRouter.post(
    "/grievances",
    grievanceLimiter,
    validateBody(createGrievanceSchema),
    asyncHandler(async (req, res) => {
        const grievance = await grievanceService.createGrievance({
            userId: req.user!.id,
            ...req.body,
        });

        res.status(201).json({
            success: true,
            message: "Grievance created successfully",
            data: grievance,
        });
    }),
);

/**
 * @route   GET /api/v1/citizen/grievances
 * @desc    Get all grievances for the current citizen
 * @access  Private (Citizen)
 */
citizenRouter.get(
    "/grievances",
    asyncHandler(async (req, res) => {
        const grievances = await grievanceService.getGrievancesByUserId(
            req.user!.id,
        );

        res.status(200).json({
            success: true,
            message: "Grievances retrieved successfully",
            data: grievances,
        });
    }),
);

/**
 * @route   GET /api/v1/citizen/grievances/:id
 * @desc    Get a specific grievance by ID (only if it belongs to the user)
 * @access  Private (Citizen)
 */
citizenRouter.get(
    "/grievances/:id",
    validateParams(grievanceIdSchema),
    asyncHandler(async (req, res) => {
        const grievance = await grievanceService.getGrievanceById(
            req.params.id!,
        );

        res.status(200).json({
            success: true,
            message: "Grievance retrieved successfully",
            data: grievance,
        });
    }),
);

/**
 * @route   PATCH /api/v1/citizen/grievances/:id
 * @desc    Update a grievance (only if it belongs to the user and is in PENDING status)
 * @access  Private (Citizen)
 */
citizenRouter.patch(
    "/grievances/:id",
    validateParams(grievanceIdSchema),
    validateBody(updateGrievanceSchema),
    asyncHandler(async (req, res) => {
        const grievance = await grievanceService.updateGrievance(
            req.params.id!,
            req.user!.id,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "Grievance updated successfully",
            data: grievance,
        });
    }),
);

/**
 * @route   DELETE /api/v1/citizen/grievances/:id
 * @desc    Delete a grievance (only if it belongs to the user and is in PENDING status)
 * @access  Private (Citizen)
 */
citizenRouter.delete(
    "/grievances/:id",
    validateParams(grievanceIdSchema),
    asyncHandler(async (req, res) => {
        await grievanceService.deleteGrievance(req.params.id!, req.user!.id);

        res.status(200).json({
            success: true,
            message: "Grievance deleted successfully",
        });
    }),
);

export default citizenRouter;
