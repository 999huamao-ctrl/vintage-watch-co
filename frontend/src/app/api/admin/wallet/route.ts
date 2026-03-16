import { NextResponse } from "next/server";
import { getWalletConfig, updateWalletConfig } from "@/lib/db";

export async function GET() {
  try {
    const config = await getWalletConfig();
    return NextResponse.json(config || {
      l1Receiving: "",
      l2Operating: "",
      l3Profit: "",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch wallet config" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { l1Receiving, l2Operating, l3Profit, updatedBy } = body;
    
    const config = await updateWalletConfig({
      l1Receiving,
      l2Operating,
      l3Profit,
      updatedBy,
    });
    
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update wallet config" },
      { status: 500 }
    );
  }
}
