import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Criacao do adapter para SQLite
const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

// Criacao do cliente Prisma com adapter
const prisma = new PrismaClient({ adapter });

export { prisma };
