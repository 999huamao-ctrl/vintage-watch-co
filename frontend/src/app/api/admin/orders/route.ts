import { NextResponse } from "next/server";
import { getOrders, updateOrderStatus } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    
    const filters = {
      ...(status && { status: status as any }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    };
    
    const orders = await getOrders(Object.keys(filters).length > 0 ? filters : undefined);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, trackingNumber, carrier } = body;
    
    const order = await updateOrderStatus(
      id,
      status,
      trackingNumber ? { trackingNumber, carrier } : undefined
    );
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
