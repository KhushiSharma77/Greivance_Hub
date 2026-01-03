import { Router } from "express";
import { authenticate } from "../../middleware/authentication";
import { isAdmin } from "../../middleware/authorization";
import { asyncHandler } from "../../lib/error-handler";
import { validateBody, validateParams } from "../../middleware/validate";
import {
    createDepartmentSchema,
    createUserSchema,
    assignDepartmentSchema,
    userIdSchema,
} from "../../types/admin.types";
import type { Request, Response } from "express";
import * as adminService from "../../services/admin.service";

const adminRouter: Router = Router();

// All admin routes require authentication
adminRouter.use(authenticate);
adminRouter.use(isAdmin);

/**
 * @route   POST /api/v1/admin/departments
 * @desc    Create a new department
 * @access  Private (Admin)
 */
adminRouter.post(
    "/departments",
    validateBody(createDepartmentSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const department = await adminService.createDepartment(req.body);

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department,
        });
    }),
);

/**
 * @route   GET /api/v1/admin/departments
 * @desc    Get all departments
 * @access  Private (Admin)
 */
adminRouter.get(
    "/departments",
    asyncHandler(async (req: Request, res: Response) => {
        const departments = await adminService.getAllDepartments();

        res.status(200).json({
            success: true,
            message: "Departments retrieved successfully",
            data: departments,
        });
    }),
);

/**
 * @route   POST /api/v1/admin/users
 * @desc    Create a new user (officer or admin)
 * @access  Private (Admin)
 */
adminRouter.post(
    "/users",
    validateBody(createUserSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const user = await adminService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    }),
);

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users (officers and admins)
 * @access  Private (Admin)
 */
adminRouter.get(
    "/users",
    asyncHandler(async (req: Request, res: Response) => {
        const users = await adminService.getAllUsers();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    }),
);

/**
 * @route   PATCH /api/v1/admin/users/:id/department
 * @desc    Assign department to user
 * @access  Private (Admin)
 */
adminRouter.patch(
    "/users/:id/department",
    validateParams(userIdSchema),
    validateBody(assignDepartmentSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const user = await adminService.assignDepartmentToUser(
            req.params.id!,
            req.body.departmentId,
        );

        res.status(200).json({
            success: true,
            message: "Department assigned to user successfully",
            data: user,
        });
    }),
);

export default adminRouter;
