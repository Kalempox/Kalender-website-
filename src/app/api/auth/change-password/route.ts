// src/app/api/auth/change-password/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// PUT: Şifre değiştir
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse("Mevcut şifre ve yeni şifre gerekli", {
        status: 400,
      });
    }

    if (newPassword.length < 6) {
      return new NextResponse("Yeni şifre en az 6 karakter olmalıdır", {
        status: 400,
      });
    }

    // Kullanıcının şifresi var mı kontrol et (sosyal giriş kullanıcılarının şifresi olmayabilir)
    if (!user.password) {
      return new NextResponse(
        "Bu hesap sosyal giriş ile oluşturulmuş. Şifre değiştirme işlemi yapılamaz.",
        { status: 400 }
      );
    }

    // Mevcut şifreyi kontrol et
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return new NextResponse("Mevcut şifre hatalı", { status: 401 });
    }

    // Yeni şifreyi hash'le
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Şifreyi güncelle
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CHANGE_PASSWORD]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

