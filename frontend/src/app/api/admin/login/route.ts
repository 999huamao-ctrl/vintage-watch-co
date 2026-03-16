import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByUsername, updateUser } from "@/lib/db";

// 硬编码默认账号（应急使用）
const DEFAULT_ACCOUNTS: Record<string, { password: string; role: string; email: string }> = {
  admin: { password: "admin123", role: "SUPERADMIN", email: "admin@horizonwatches.com" },
};

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // 首先检查硬编码默认账号
    if (DEFAULT_ACCOUNTS[username] && DEFAULT_ACCOUNTS[username].password === password) {
      return NextResponse.json({
        token: `token-${username}`,
        user: {
          id: username,
          username: username,
          email: DEFAULT_ACCOUNTS[username].email,
          role: DEFAULT_ACCOUNTS[username].role,
        },
      });
    }
    
    // 查找数据库用户
    try {
      const user = await getUserByUsername(username);
      
      if (!user) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
      
      // 验证密码
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
      
      // 检查用户是否激活
      if (!user.isActive) {
        return NextResponse.json(
          { error: "Account is disabled" },
          { status: 401 }
        );
      }
      
      // 更新最后登录时间（忽略错误）
      try {
        await updateUser(user.id, { lastLoginAt: new Date() });
      } catch {
        // 忽略更新错误
      }
      
      return NextResponse.json({
        token: `token-${user.id}`,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (dbError) {
      // 数据库错误时，只允许硬编码账号登录
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
