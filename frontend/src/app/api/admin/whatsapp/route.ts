import { NextResponse } from "next/server";
import {
  getWhatsAppLinks,
  getRandomWhatsAppLink,
  createWhatsAppLink,
  updateWhatsAppLink,
  deleteWhatsAppLink,
} from "@/lib/db";
import { checkAdminPermission, requireAdmin } from "@/lib/auth";

// 获取所有 WA 链接 (需要登录)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const random = searchParams.get("random");

    if (random === "true") {
      // 公开接口：获取随机一个活跃的链接
      const link = await getRandomWhatsAppLink();
      if (!link) {
        return NextResponse.json(
          { error: "No WhatsApp links available" },
          { status: 404 }
        );
      }
      return NextResponse.json(link);
    }

    // 需要权限：获取所有链接
    const authError = await checkAdminPermission(request, ["settings"]);
    if (authError) return authError;

    const links = await getWhatsAppLinks();
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch WhatsApp links" },
      { status: 500 }
    );
  }
}

// 创建 WA 链接 (仅 ADMIN/SUPERADMIN)
export async function POST(request: Request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const { name, url, createdBy } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    const link = await createWhatsAppLink({
      name,
      url,
      createdBy,
    });

    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create WhatsApp link" },
      { status: 500 }
    );
  }
}

// 更新 WA 链接 (仅 ADMIN/SUPERADMIN)
export async function PUT(request: Request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const link = await updateWhatsAppLink(id, data);
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update WhatsApp link" },
      { status: 500 }
    );
  }
}

// 删除 WA 链接 (仅 ADMIN/SUPERADMIN)
export async function DELETE(request: Request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await deleteWhatsAppLink(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete WhatsApp link" },
      { status: 500 }
    );
  }
}