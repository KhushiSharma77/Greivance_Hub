import { Router } from "express";
import adminRouter from "./admin.routes";
import authRouter from "./auth.routes";
import { type Multer } from 'multer'
import { SupabaseClient } from '@supabase/supabase-js'
import citizenRouter from "./citizen.routes";
import officerRouter from "./officer.routes";

export default function routes(upload: Multer, supabase: SupabaseClient) {
  const router: Router = Router();
  
  router.use('/admin', adminRouter);
  router.use('/auth', authRouter);
  router.use('/citizen', citizenRouter(upload, supabase));
  router.use('/officer', officerRouter);

  return router;
}