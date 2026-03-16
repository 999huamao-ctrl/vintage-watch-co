import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByUsername, updateUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // 查找用户
    const user = await getUserByUsername(username);
    
    if (!user) {
      // 检查是否是默认管理员登录（首次使用）
      if (username === "admin" && password === "admin123") {
        return NextResponse.json({
          token: "admin-token",
          user: {
            id: "admin",
            username: "admin",
            email: "admin@horizonwatches.com",
            role: "SUPERADMIN",
          },
        });
      }
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // 更新最后登录时间
    await updateUser(user.id, { lastLoginAt: new Date() });
    
    return NextResponse.json({
      token: `token-${user.id}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
