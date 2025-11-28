// src/app/api/addresses/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { isValidCity } from "@/lib/turkey-cities";

// GET: Kullanıcının tüm adreslerini listele
export async function GET() {
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

    const addresses = await db.address.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: "desc" }, // Varsayılan adres en üstte
        { createdAt: "desc" }, // Son eklenenler en üstte
      ],
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("[ADDRESSES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST: Yeni adres ekle
export async function POST(req: Request) {
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
    const {
      type,
      title,
      fullName,
      phone,
      address,
      city,
      district,
      postalCode,
      isDefault,
    } = body;

    // Gerekli alanları kontrol et
    if (!type || !title || !fullName || !phone || !address || !city) {
      return new NextResponse("Gerekli alanlar eksik", { status: 400 });
    }

    // Şehir doğrulaması - SEO uyumlu hata mesajı
    if (!isValidCity(city)) {
      return new NextResponse(
        JSON.stringify({
          error: "Bu şehre teslimat yapılmamaktadır. Lütfen geçerli bir şehir seçin.",
          allowedCities: ["Gaziantep", "Malatya", "Kahramanmaraş", "Adıyaman", "Şanlıurfa", "Elazığ"],
        }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Eğer varsayılan adres olarak işaretlenmişse, diğer varsayılan adresleri kaldır
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await db.address.create({
      data: {
        userId: user.id,
        type,
        title,
        fullName,
        phone,
        address,
        city,
        district: district || null,
        postalCode: postalCode || null,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("[ADDRESSES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

