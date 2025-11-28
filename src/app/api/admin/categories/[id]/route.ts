// src/app/api/admin/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createSlug } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Tek bir kategoriyi getir
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

    const category = await db.category.findUnique({
      where: { id },
      include: {
        parent: true,
        subCategories: true,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("[ADMIN_CATEGORY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT: Kategoriyi güncelle
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
    const { name, parentId, imageUrl } = body;

    if (!name) {
      return new NextResponse("Kategori adı gereklidir", { status: 400 });
    }

    // Slug oluştur
    const slug = createSlug(name);

    // Aynı slug'a sahip başka bir kategori var mı kontrol et (kendi hariç)
    const existingCategory = await db.category.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (existingCategory) {
      return new NextResponse(
        "Bu isimde bir kategori zaten mevcut",
        { status: 400 }
      );
    }

    // Eğer parentId varsa, parent'ın var olduğunu ve kendisi olmadığını kontrol et
    if (parentId) {
      if (parentId === id) {
        return new NextResponse(
          "Kategori kendi alt kategorisi olamaz",
          { status: 400 }
        );
      }

      const parent = await db.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        return new NextResponse("Ana kategori bulunamadı", { status: 404 });
      }
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name,
        slug,
        parentId: parentId || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[ADMIN_CATEGORY_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Kategoriyi sil
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

    // Kategori var mı ve ilişkili veriler var mı kontrol et
    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            subCategories: true,
          },
        },
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    if (category._count.products > 0) {
      return new NextResponse(
        "Bu kategoriye ait ürünler var. Önce ürünleri silin veya taşıyın.",
        { status: 400 }
      );
    }

    if (category._count.subCategories > 0) {
      return new NextResponse(
        "Bu kategoriye ait alt kategoriler var. Önce alt kategorileri silin.",
        { status: 400 }
      );
    }

    await db.category.delete({
      where: { id },
    });

    return new NextResponse("Category deleted", { status: 200 });
  } catch (error) {
    console.error("[ADMIN_CATEGORY_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

