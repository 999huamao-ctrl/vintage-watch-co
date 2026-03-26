import { NextResponse } from "next/server";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/db";
import { checkAdminPermission, requireSuperAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    // Only users permission (SUPERADMIN) can access
    const authError = await checkAdminPermission(request, ["users"]);
    if (authError) return authError;
    
    console.log("Fetching users, DATABASE_URL exists:", !!process.env.DATABASE_URL);
    
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Only SUPERADMIN can create users
    const authError = await requireSuperAdmin(request);
    if (authError) return authError;
    
    const body = await request.json();
    const { username, email, password, role } = body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
      role,
    });
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Only SUPERADMIN can update users
    const authError = await requireSuperAdmin(request);
    if (authError) return authError;
    
    const body = await request.json();
    const { id, ...data } = body;
    
    const user = await updateUser(id, data);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Only SUPERADMIN can delete users
    const authError = await requireSuperAdmin(request);
    if (authError) return authError;
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID required" },
        { status: 400 }
      );
    }
    
    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
