import { NextResponse } from "next/server";
import { getOrders, getProducts, getInventoryLogs, getDailyReports, getUsers } from "@/lib/db";

function jsonToCsv(data: any[]): string {
  if (data.length === 0) return "";
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map(row =>
      headers
        .map(h => {
          const val = row[h];
          if (val === null || val === undefined) return "";
          if (typeof val === "object") return JSON.stringify(val);
          const str = String(val);
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(",")
    ),
  ];
  return csvRows.join("\n");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const format = searchParams.get("format") || "json";
    
    let data: any[] = [];
    let filename = "";
    
    switch (type) {
      case "orders":
        data = await getOrders();
        filename = `orders-${new Date().toISOString().split("T")[0]}`;
        break;
      case "products":
        data = await getProducts();
        filename = `products-${new Date().toISOString().split("T")[0]}`;
        break;
      case "inventory":
        data = await getInventoryLogs();
        filename = `inventory-${new Date().toISOString().split("T")[0]}`;
        break;
      case "reports":
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        data = await getDailyReports(
          startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate ? new Date(endDate) : new Date()
        );
        filename = `reports-${new Date().toISOString().split("T")[0]}`;
        break;
      case "users":
        data = await getUsers();
        filename = `users-${new Date().toISOString().split("T")[0]}`;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid export type" },
          { status: 400 }
        );
    }
    
    if (format === "csv") {
      const csv = jsonToCsv(data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}.csv"`,
        },
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
