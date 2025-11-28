// src/app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Tek bir kullanıcıyı getir
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ADMIN_USER_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT: Kullanıcıyı güncelle (rol değiştirme)
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { role } = body;

    if (!role || !["USER", "ADMIN"].includes(role)) {
      return new NextResponse("Geçerli bir rol seçin (USER veya ADMIN)", {
        status: 400,
      });
    }

    // Kendi rolünü değiştirmeye çalışıyorsa
    if (session.user.id === id) {
      return new NextResponse("Kendi rolünüzü değiştiremezsiniz", {
        status: 400,
      });
    }

    const user = await db.user.update({
      where: { id },
      data: {
        role,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ADMIN_USER_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Kullanıcıyı sil
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Kendini silmeye çalışıyorsa
    if (session.user.id === id) {
      return new NextResponse("Kendi hesabınızı silemezsiniz", {
        status: 400,
      });
    }

    // Kullanıcıyı kontrol et
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Kullanıcıyı sil (cascade ile ilgili tüm veriler silinecek)
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    console.error("[ADMIN_USER_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

