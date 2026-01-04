import { Router } from "express";
import { authenticate } from "../../middleware/authentication";
import { isOfficer } from "../../middleware/authorization";
import { asyncHandler } from "../../lib/error-handler";
import { validateBody, validateParams } from "../../middleware/validate";
import { updateGrievanceStatusSchema } from "../../types/officer.types";
import { grievanceIdSchema } from "../../types/grievance.types";
import { getGrievanceById } from "../../services/grievance.service";
import * as officerService from "../../services/officer.service";
import prisma from "@team-call-of-code/db";
import { ForbiddenError } from "../../lib/error-handler";

const officerRouter: Router = Router();

// All officer routes require authentication
officerRouter.use(authenticate);
officerRouter.use(isOfficer);

/**
 * @route   GET /api/v1/officer/grievances
 * @desc    Get all grievances for officer's department
 * @access  Private (Officer)
 */
officerRouter.get(
    "/grievances",
    asyncHandler(async (req, res) => {
        // Get officer's department
        const officer = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { departmentId: true },
        });

        if (!officer?.departmentId) {
            throw new ForbiddenError("Officer must be assigned to a department");
        }

        const grievances = await officerService.getAllGrievancesByDepartment(officer.departmentId);

        res.status(200).json({
            success: true,
            message: "Grievances retrieved successfully",
            data: grievances,
        });
    }),
);

/**
 * @route   GET /api/v1/officer/grievances/:id
 * @desc    Get a specific grievance by ID with AI metadata
 * @access  Private (Officer)
 */
officerRouter.get(
    "/grievances/:id",
    validateParams(grievanceIdSchema),
    asyncHandler(async (req, res) => {
        const grievance = await getGrievanceById(
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
 * @route   PATCH /api/v1/officer/grievances/:id/status
 * @desc    Update grievance status
 * @access  Private (Officer)
 */
officerRouter.patch(
    "/grievances/:id/status",
    validateParams(grievanceIdSchema),
    validateBody(updateGrievanceStatusSchema),
    asyncHandler(async (req, res) => {
        const grievance = await officerService.updateGrievanceStatus(
            req.params.id!,
            req.body.status,
        );

        res.status(200).json({
            success: true,
            message: "Grievance status updated successfully",
            data: grievance,
        });
    }),
);

export default officerRouter;
