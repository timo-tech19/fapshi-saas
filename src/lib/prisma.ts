// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Declare a global variable to hold the Prisma Client instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client
// In development, use the global variable to avoid creating multiple instances
// due to Next.js hot reloading.
// In production, always create a new instance.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
