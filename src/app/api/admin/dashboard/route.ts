import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/db";

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { 
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        todayRevenue: 0,
        todayOrders: 0,
      },
      { status: 200 }
    );
  }
}
