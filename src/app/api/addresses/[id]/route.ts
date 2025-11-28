// src/app/api/addresses/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { isValidCity } from "@/lib/turkey-cities";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT: Adres güncelle
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Adresin kullanıcıya ait olduğunu kontrol et
    const address = await db.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!address) {
      return new NextResponse("Address not found", { status: 404 });
    }

    const body = await req.json();
    const {
      type,
      title,
      fullName,
      phone,
      address: addressLine,
      city,
      district,
      postalCode,
      isDefault,
    } = body;

    // Şehir doğrulaması - SEO uyumlu hata mesajı
    if (city && !isValidCity(city)) {
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
    if (isDefault && !address.isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await db.address.update({
      where: { id },
      data: {
        type: type || address.type,
        title: title || address.title,
        fullName: fullName || address.fullName,
        phone: phone || address.phone,
        address: addressLine || address.address,
        city: city || address.city,
        district: district !== undefined ? district : address.district,
        postalCode: postalCode !== undefined ? postalCode : address.postalCode,
        isDefault: isDefault !== undefined ? isDefault : address.isDefault,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("[ADDRESSES_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Adres sil
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Adresin kullanıcıya ait olduğunu kontrol et
    const address = await db.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!address) {
      return new NextResponse("Address not found", { status: 404 });
    }

    await db.address.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ADDRESSES_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

