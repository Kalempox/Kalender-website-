// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Tek bir ürünü getir
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

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT: Ürünü güncelle
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

    const product = await db.product.update({
      where: { id },
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
    console.error("[ADMIN_PRODUCT_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Ürünü sil
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

    await db.product.delete({
      where: { id },
    });

    return new NextResponse("Product deleted", { status: 200 });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

