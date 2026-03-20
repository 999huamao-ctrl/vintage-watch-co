import { NextResponse } from "next/server";
import { prisma } from "./db";

// 角色权限映射
const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPERADMIN: ["dashboard", "products", "orders", "users", "settings", "finance", "analytics", "inventory", "shipping"],
  ADMIN: ["dashboard", "products", "orders", "inventory"],
  SUPPLY: ["dashboard", "products", "inventory"],
  LOGISTICS: ["dashboard", "orders", "shipping"],
  CUSTOMER: [],
};

// 从请求头中提取 token 并验证用户
export async function getCurrentUser(request: Request) {
  try {
    // 从 Authorization 头或自定义 X-Admin-Token 头获取 token
    const authHeader = request.headers.get("authorization");
    const adminToken = request.headers.get("x-admin-token");
    
    const token = authHeader?.replace("Bearer ", "") || adminToken;
    
    if (!token) {
      return null;
    }
    
    // 检查是否是硬编码 token（开发测试用）
    if (token.startsWith("token-")) {
      const username = token.replace("token-", "");
      return {
        id: username,
        username,
        role: username === "admin" ? "SUPERADMIN" : "ADMIN",
        isActive: true,
      };
    }
    
    // TODO: 实现 JWT 验证逻辑
    // 目前简单返回 null，让硬编码账号可以工作
    return null;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

// 检查用户是否有指定权限
export async function checkAdminPermission(
  request: Request,
  requiredPermissions: string[]
): Promise<NextResponse | null> {
  const user = await getCurrentUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  if (!user.isActive) {
    return NextResponse.json(
      { error: "Account is disabled" },
      { status: 403 }
    );
  }
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  
  // 检查是否有任意一个所需权限
  const hasPermission = requiredPermissions.some(perm => 
    userPermissions.includes(perm)
  );
  
  if (!hasPermission) {
    return NextResponse.json(
      { error: "Forbidden - insufficient permissions" },
      { status: 403 }
    );
  }
  
  return null;
}

// 检查用户是否为 SUPERADMIN
export async function requireSuperAdmin(request: Request): Promise<NextResponse | null> {
  const user = await getCurrentUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  if (user.role !== "SUPERADMIN") {
    return NextResponse.json(
      { error: "Forbidden - Super Admin required" },
      { status: 403 }
    );
  }
  
  return null;
}
