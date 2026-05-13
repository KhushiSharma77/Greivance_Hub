import "dotenv/config";
import { env } from "@team-call-of-code/env/server";
import cors from "cors";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import routes from "./routes/v1";
import multer from "multer";
import { errorHandler } from "./lib/error-handler";

// Initialize BullMQ background AI workers
import "./worker/src/index";

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);


const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"],
  }),
);

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Increased to 5MB
});


app.get("/", async (_req, res) => {
  res.status(200).send("OK");
});

app.use("/api/v1", routes(upload, supabase));

// Error handler must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
