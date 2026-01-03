import { env } from "@team-call-of-code/env/server";
import cors from "cors";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import routes from "./routes/v1";
import multer from "multer";
import "dotenv/config";

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);
import grievanceRoutes from "./routes/v1/processor.routes"

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }
});


app.use("/api/grievance",grievanceRoutes );

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/api/v1", routes(upload, supabase));

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
