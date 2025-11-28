// src/app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// POST: Yeni ürün ekle
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, stock, categoryId, thumbnailUrl, imageUrl, technicalDetails } =
      body;

    if (!name || !price || !categoryId) {
      return new NextResponse("Gerekli alanlar eksik", { status: 400 });
    }

    // Kategori var mı kontrol et
    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return new NextResponse("Kategori bulunamadı", { status: 404 });
    }

    const product = await db.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        categoryId,
        thumbnailUrl: thumbnailUrl || null,
        imageUrl: imageUrl || null,
        technicalDetails: technicalDetails || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// GET: Tüm ürünleri listele (admin için)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const products = await db.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

