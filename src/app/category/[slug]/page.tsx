// src/app/category/[slug]/page.tsx
import Image from "next/image";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/SEO/StructuredData";
// createSlug'a burada ihtiyacımız yoktu, kaldırıldı.

// Sayfa parametre tipi (Next.js 15 uyumlu)
interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    subCategory?: string;
  }>;
}

// Slug'a göre KATEGORİYİ ve ilişkili verileri çeken fonksiyon
async function getCategoryData(slug: string) {
  const category = await db.category.findUnique({
    where: { slug: slug },
    include: {
      subCategories: { orderBy: { name: "asc" } },
      parent: true,
    },
  });
  if (!category) notFound();
  return category;
}

// Dinamik Metadata - SEO için çok önemli
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryData(slug);

  const baseUrl = process.env.NEXTAUTH_URL || "https://kalender.com";
  const categoryUrl = `${baseUrl}/category/${slug}`;

  const categoryName = category.parent
    ? `${category.parent.name} - ${category.name}`
    : category.name;

  const title = `Toptan ${categoryName} | Kalender Toptan - Gaziantep`;
  const description = `${categoryName} kategorisinde kaliteli toptan ürünler. En uygun fiyatlarla toptan alışveriş yapın. Gaziantep, Kahramanmaraş, Adıyaman ve Malatya bölgelerine teslimat.`;

  return {
    title,
    description,
    keywords: [
      categoryName,
      "toptan",
      "toptan gıda",
      "toptan alışveriş",
      "gaziantep toptan",
      "kalender",
      "toptan satış",
      "toptan alım satım",
      category.parent ? category.parent.name : "",
      category.name,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: categoryUrl,
      siteName: "Kalender Toptan",
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}

// Kategoriye (ve varsa alt kategoriye) göre ÜRÜNLERİ çeken fonksiyon
async function getCategoryProducts(
  categoryId: string,
  parentId: string | null,
  subCategorySlug?: string
) {
  let whereClause: Record<string, unknown> = {};
  let targetCategoryId = categoryId;

  if (subCategorySlug) {
    const subCategory = await db.category.findUnique({
      where: {
        slug: subCategorySlug,
        parentId: parentId === categoryId ? categoryId : undefined,
      },
    });
    if (subCategory) {
      targetCategoryId = subCategory.id;
      whereClause = { categoryId: targetCategoryId };
    } else {
      return [];
    }
  } else if (!parentId) {
    whereClause = {
      OR: [{ categoryId: categoryId }, { category: { parentId: categoryId } }],
    };
  } else {
    whereClause = { categoryId: categoryId };
  }

  const products = await db.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 12,
  });
  return products;
}

/**
 * Dinamik Kategori Sayfası
 */
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { subCategory: subCategorySlug } = await searchParams;

  const category = await getCategoryData(slug);
  const isMainCategory = !category.parentId;
  const products = await getCategoryProducts(
    category.id,
    category.parentId,
    subCategorySlug
  );

  // subCategories'in varlığını ve tipini güvenli kontrol edelim
  const subCategories = Array.isArray(category.subCategories)
    ? category.subCategories
    : [];

  const baseUrl = process.env.NEXTAUTH_URL || "https://kalender.com";
  const categoryUrl = `${baseUrl}/category/${slug}`;

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: baseUrl },
  ];

  if (category.parent) {
    breadcrumbItems.push({
      name: category.parent.name,
      url: `${baseUrl}/category/${category.parent.slug}`,
    });
  }

  breadcrumbItems.push({
    name: category.name,
    url: categoryUrl,
  });

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <main className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">
        {category.name} Kategorisi
      </h1>

      {/* Alt Kategori Filtreleri (biraz daha aşağı alındı) */}
      {isMainCategory && subCategories.length > 0 && (
        <div className="mt-12 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">
            Alt Kategoriler
          </h2>
          <nav className="flex flex-wrap justify-center gap-2">
            <Button asChild variant={!subCategorySlug ? "default" : "outline"}>
              <Link href={`/category/${slug}`}>Tümü</Link>
            </Button>
            {subCategories.map((sub) => (
              <Button
                key={sub.id}
                asChild
                variant={subCategorySlug === sub.slug ? "default" : "outline"}
              >
                <Link href={`/category/${slug}?subCategory=${sub.slug}`}>
                  {sub.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      )}

      {/* Ürün Listesi (kart tamamı tıklanabilir) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col w-full">
            <Link href={`/product/${product.id}`} className="cursor-pointer">
              <CardHeader>
                <div className="relative aspect-square w-full overflow-hidden rounded-md">
                  <Image
                    src={product.thumbnailUrl || product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 330px"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {product.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.category.name}
                </p>
              </CardContent>
            </Link>
            <CardFooter className="flex justify-between items-center">
              <span className="text-xl font-bold">
                {product.price.toFixed(2)} TL
              </span>
              <AddToCartButton product={product} />
            </CardFooter>
          </Card>
        ))}
        {products.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            Bu kategoride ürün bulunamadı.
          </p>
        )}
      </div>
      {/* TODO: Sayfalama eklenecek */}
      </main>
    </>
  );
}
