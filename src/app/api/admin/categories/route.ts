// src/app/api/admin/categories/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createSlug } from "@/lib/utils";

// POST: Yeni kategori ekle
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
    const { name, parentId, imageUrl } = body;

    if (!name) {
      return new NextResponse("Kategori adı gereklidir", { status: 400 });
    }

    // Slug oluştur
    const slug = createSlug(name);

    // Aynı slug'a sahip kategori var mı kontrol et
    const existingCategory = await db.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return new NextResponse(
        "Bu isimde bir kategori zaten mevcut",
        { status: 400 }
      );
    }

    // Eğer parentId varsa, parent'ın var olduğunu kontrol et
    if (parentId) {
      const parent = await db.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        return new NextResponse("Ana kategori bulunamadı", { status: 404 });
      }
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        parentId: parentId || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// GET: Tüm kategorileri listele (admin için)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const categories = await db.category.findMany({
      include: {
        parent: true,
        subCategories: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

