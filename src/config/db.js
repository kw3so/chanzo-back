import {PrismaClient} from "../../generated/prisma/client.ts"

import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = (process.env.APP === "development")
  ? process.env.DEV_DATABASE_URL
  : process.env.DATABASE_URL;

const adapter = new PrismaPg(connectionString);

export const prisma = new PrismaClient({ adapter });
