import { Router } from "express";
import {normalizeComplaintController} from "../../worker/src/processors/multilingual.processor";
import { analyzeGrievanceController } from "../../worker/src/processors/master.processor";

const router:Router = Router();

router.post("/normalize", normalizeComplaintController);
router.post("/analyze", analyzeGrievanceController);

export default router;
