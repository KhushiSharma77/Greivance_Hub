import { Router } from "express";
import { authenticate } from "../../middleware/authentication";
import { isCitizen } from "../../middleware/authorization";
import { asyncHandler } from "../../lib/error-handler";
import { grievanceLimiter } from "../../middleware/rate-limit";
import { validateParams } from "../../middleware/validate";
import {
    grievanceIdSchema,
} from "../../types/grievance.types";
import * as grievanceService from "../../services/grievance.service";
import * as profileService from "../../services/profile.service";
import { type Multer } from 'multer'
import { SupabaseClient } from '@supabase/supabase-js'
import type { Request, Response, NextFunction } from "express";
import { multilingualQueue } from "@/lib/multilingual.queue";
import { v4 as uuidv4 } from 'uuid';
import * as emailService from "../../services/email.service";
import prisma from "@team-call-of-code/db";

function parseData(req: Request, res: Response, next: NextFunction) {
    if (req.body.data) {
        try {
            const data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
            req.body = { ...req.body, ...data };
            delete req.body.data;
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON in data field'
            });
        }
    }
    next();
}

export default function citizenRouter(
    upload: Multer,
    supabase: SupabaseClient,
) {
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
        upload.single("photo"),
        parseData,
        asyncHandler(async (req: Request, res: Response) => {
            if (!req.file) {
                const grievance = await grievanceService.createGrievance({
                    userId: req.user!.id,
                    ...req.body,
                });
                await multilingualQueue.add("multilingual-process",{
                grievanceId:grievance.id,
                text:grievance.originalText
            })

                // Send confirmation email
                if (req.user?.id) {
                    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true } });
                    console.log(`[AUTH] Grievance created by user ${req.user.id}. Email: ${user?.email}`);
                    if (user?.email) {
                        emailService.sendGrievanceConfirmation(user.email, grievance).catch(err => {
                            console.error(`[AUTH] Failed to send grievance confirmation:`, err);
                        });
                    } else {
                        console.log(`[AUTH] No email found for user ${req.user.id}, skipping confirmation email.`);
                    }
                }

                return res.status(201).json({
                    success: true,
                    message: "Grievance created successfully",
                    data: grievance,
                });
            }

            const grievance = await grievanceService.createGrievance(
                {
                    userId: req.user!.id,
                    ...req.body,
                },
                req.file
            );
            
            await multilingualQueue.add("multilingual-process",{
                grievanceId:grievance.id,
                text:grievance.originalText
            })

            // Send confirmation email
            if (req.user?.id) {
                const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true } });
                console.log(`[AUTH] Grievance (with file) created by user ${req.user.id}. Email: ${user?.email}`);
                if (user?.email) {
                    emailService.sendGrievanceConfirmation(user.email, grievance).catch(err => {
                        console.error(`[AUTH] Failed to send grievance confirmation:`, err);
                    });
                } else {
                    console.log(`[AUTH] No email found for user ${req.user.id}, skipping confirmation email.`);
                }
            }

            return res.status(202).json({
                success: true,
                message: "Grievance created successfully",
                data: grievance,
            });
        })

    );

    /**
     * @route   GET /api/v1/citizen/grievances
     * @desc    Get all grievances for the current citizen
     * @access  Private (Citizen)
     */
    citizenRouter.get(
        "/grievances",
        asyncHandler(async (req: Request, res: Response) => {
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
        asyncHandler(async (req: Request, res: Response) => {
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
        upload.single("photo"),
        parseData,
        validateParams(grievanceIdSchema),
        asyncHandler(async (req: Request, res: Response) => {
            const grievance = await grievanceService.updateGrievance(
                req.params.id!,
                req.user!.id,
                req.file,
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
        asyncHandler(async (req: Request, res: Response) => {
            await grievanceService.deleteGrievance(req.params.id!, req.user!.id);

            res.status(200).json({
                success: true,
                message: "Grievance deleted successfully",
            });
        }),
    );

    /**
     * @route   GET /api/v1/citizen/profile
     * @desc    Get current citizen's profile
     * @access  Private (Citizen)
     */
    citizenRouter.get(
        "/profile",
        asyncHandler(async (req: Request, res: Response) => {
            const profile = await profileService.getProfile(req.user!.id);
            res.status(200).json({
                success: true,
                data: profile,
            });
        }),
    );

    /**
     * @route   PATCH /api/v1/citizen/profile
     * @desc    Update citizen profile info
     * @access  Private (Citizen)
     */
    citizenRouter.patch(
        "/profile",
        asyncHandler(async (req: Request, res: Response) => {
            const { name, phone, address, aadhaarNumber } = req.body;
            const profile = await profileService.updateProfile(req.user!.id, {
                name,
                phone,
                address,
                aadhaarNumber,
            });
            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: profile,
            });
        }),
    );

    /**
     * @route   POST /api/v1/citizen/profile/picture
     * @desc    Upload profile picture
     * @access  Private (Citizen)
     */
    citizenRouter.post(
        "/profile/picture",
        upload.single("photo"),
        asyncHandler(async (req: Request, res: Response) => {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            const fileName = `profiles/${req.user!.id}-${uuidv4()}.${req.file.originalname.split('.').pop()}`;
            const { data, error } = await supabase.storage
                .from("Grievance")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true,
                });

            if (error) throw error;

            const { data: publicUrl } = supabase.storage
                .from("Grievance")
                .getPublicUrl(fileName);

            const profile = await profileService.updateProfilePicture(
                req.user!.id,
                publicUrl.publicUrl
            );

            res.status(200).json({
                success: true,
                message: "Profile picture updated",
                data: profile,
            });
        }),
    );

    return citizenRouter;
}
