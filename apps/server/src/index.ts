import { env } from "@team-call-of-code/env/server";
import cors from "cors";
import express from "express";
import grievanceRoutes from "./routes/v1/processor.routes"
import routes from "./routes/v1";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(express.json());

app.use("/api/grievance",grievanceRoutes );

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
