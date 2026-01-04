import prisma from "@team-call-of-code/db";
import { env } from "@team-call-of-code/env/server";
import cors from "cors";
import express from "express";
import { multilingualQueue } from "./lib/multilingual.queue";


const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(express.json());

app.get("/", async (_req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
