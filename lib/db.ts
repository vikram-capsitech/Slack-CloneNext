import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;


// we can simply use direct const db = ne PrismaClient() but because of next js hot reload it will create many prisma client on every reload.
// so that's why we add a condition to make it better 
