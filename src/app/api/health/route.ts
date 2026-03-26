import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({
      status: "ok",
      database: "connected",
      result,
      env: {
        databaseUrlExists: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({
      status: "error",
      database: "disconnected",
      error: String(error),
      env: {
        databaseUrlExists: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    }, { status: 500 });
  }
}
