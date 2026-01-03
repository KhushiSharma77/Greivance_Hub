import { Router } from "express";
import adminRouter from "./admin.routes";
import authRouter from "./auth.routes";
import citizenRouter from "./citizen.routes";
import officerRouter from "./officer.routes";

export default function routes() {
  const router:Router = Router();
  router.use('/admin', adminRouter)

  router.use('/auth',authRouter)

  router.use('/citizen',citizenRouter);
  router.use('/officer',officerRouter);

  return router;
}