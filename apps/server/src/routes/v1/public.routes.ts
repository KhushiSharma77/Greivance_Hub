import { Router } from "express";
import { authenticate } from "../../middleware/authentication";
import { asyncHandler } from "../../lib/error-handler";
import * as socialService from "../../services/social.service";
import type { Request, Response } from "express";

export default function publicRouter() {
    const router: Router = Router();

    // The feed should be viewable, but we might want users to be authenticated to view it.
    router.use(authenticate);

    /**
     * @route   GET /api/v1/feed
     * @desc    Get the social grievance feed
     * @access  Private (Any authenticated user)
     */
    router.get(
        "/",
        asyncHandler(async (_req: Request, res: Response) => {
            const feed = await socialService.getPublicFeed();
            res.status(200).json({
                success: true,
                data: feed,
            });
        })
    );

    /**
     * @route   POST /api/v1/feed/:id/upvote
     * @desc    Toggle upvote
     */
    router.post(
        "/:id/upvote",
        asyncHandler(async (req: Request, res: Response) => {
            const result = await socialService.toggleUpvote(req.params.id!, req.user!.id);
            res.status(200).json({
                success: true,
                ...result
            });
        })
    );

    /**
     * @route   GET /api/v1/feed/:id/comments
     * @desc    Get comments
     */
    router.get(
        "/:id/comments",
        asyncHandler(async (req: Request, res: Response) => {
            const comments = await socialService.getComments(req.params.id!);
            res.status(200).json({
                success: true,
                data: comments,
            });
        })
    );

    /**
     * @route   POST /api/v1/feed/:id/comments
     * @desc    Add a comment
     */
    router.post(
        "/:id/comments",
        asyncHandler(async (req: Request, res: Response) => {
            const { content } = req.body;
            if (!content) {
                return res.status(400).json({ success: false, message: "Comment content is required" });
            }
            const comment = await socialService.addComment(req.params.id!, req.user!.id, content);
            res.status(201).json({
                success: true,
                data: comment,
            });
        })
    );

    return router;
}
