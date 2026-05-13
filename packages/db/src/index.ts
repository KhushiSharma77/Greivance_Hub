import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient as BasePrismaClient } from "../prisma/generated/client";
import { env } from "@team-call-of-code/env/server";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

export const prisma = new BasePrismaClient({ adapter });

export * from "../prisma/generated/client";
export default prisma;