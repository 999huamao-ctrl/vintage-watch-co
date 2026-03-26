import { NextResponse } from "next/server";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/db";
import { checkAdminPermission } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Check permission (products or inventory can view)
    const authError = await checkAdminPermission(request, ["products", "inventory"]);
    if (authError) return authError;
    
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Only products permission can create
    const authError = await checkAdminPermission(request, ["products"]);
    if (authError) return authError;
    
    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    // Check if only updating stock (inventory permission)
    const isStockOnlyUpdate = Object.keys(data).length === 1 && 'stock' in data;
    const requiredPermissions = isStockOnlyUpdate ? ["products", "inventory"] : ["products"];
    
    const authError = await checkAdminPermission(request, requiredPermissions);
    if (authError) return authError;
    
    const product = await updateProduct(id, data);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Only products permission can delete
    const authError = await checkAdminPermission(request, ["products"]);
    if (authError) return authError;
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID required" },
        { status: 400 }
      );
    }
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
