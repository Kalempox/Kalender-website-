// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db"; // Prisma Client
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddToCartButton } from "@/components/AddToCartButton";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BestsellersCarousel } from "@/components/home/BestsellersCarousel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { OrganizationSchema } from "@/components/SEO/StructuredData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalender Toptan | Gaziantep Toptan Gıda, Toptan Alışveriş",
  description:
    "Kalender Toptan - 1962'den beri Türkiye'nin güvenilir toptan adresi. Gaziantep, Kahramanmaraş, Adıyaman ve Malatya bölgelerine toptan gıda, toptan alışveriş, toptan satış hizmeti. En uygun fiyatlarla kaliteli ürünler.",
  keywords: [
    "toptan",
    "toptan gıda",
    "toptan alışveriş",
    "toptan satış",
    "toptan alım satım",
    "gaziantep toptan",
    "kalender",
    "kalender toptan",
    "toptan market",
    "gaziantep toptan satış",
    "gaziantep toptan gıda",
  ],
};

// Sayfa başına gösterilecek ürün sayısı
const PRODUCTS_PER_PAGE = 12;

/**
 * Sayfa props'ları: 'page' parametresini alır
 */
interface HomePageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

/**
 * Veritabanından belirli bir sayfadaki ürünleri VE toplam ürün sayısını çeker.
 */
async function getPaginatedProducts(page: number) {
  const skip = (page - 1) * PRODUCTS_PER_PAGE;
  const take = PRODUCTS_PER_PAGE;

  const [products, totalProducts] = await Promise.all([
    db.product.findMany({
      skip: skip,
      take: take,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    db.product.count(),
  ]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return { products, totalProducts, totalPages };
}

/**
 * En çok satan ürünleri çeker (örnek: son eklenen 12 ürün)
 */
async function getBestsellers() {
  return await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 12,
  });
}

/**
 * Hero Carousel için ürünleri çeker (öne çıkan ürünler)
 */
async function getFeaturedProducts() {
  return await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 8, // Hero carousel için 8 ürün
  });
}

/**
 * Ana Sayfa Bileşeni (Sayfalama ve Tam Kart Yapısı ile)
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1") || 1;
  const { products, totalPages } = await getPaginatedProducts(currentPage);
  const bestsellers = await getBestsellers();
  const featuredProducts = await getFeaturedProducts();

  const baseUrl = process.env.NEXTAUTH_URL || "https://kalender.com";

  return (
    <>
      <OrganizationSchema
        name="Kalender Toptan"
        url={baseUrl}
        logo="/logo.png"
        address={{
          streetAddress: "Örnek Mahallesi, Örnek Sokak No: 123",
          addressLocality: "Gaziantep",
          addressRegion: "Gaziantep",
          postalCode: "27000",
          addressCountry: "TR",
        }}
        contactPoint={{
          telephone: "+90 555 123 45 67",
          contactType: "customer service",
          email: "info@kalender.com",
        }}
      />
      <main className="container mx-auto py-12 px-4">
        {/* Hero Carousel - Öne Çıkan Ürünler */}
        <HeroCarousel products={featuredProducts} />

      {/* En Çok Satanlar Carousel */}
      <BestsellersCarousel products={bestsellers} />

      {/* Tüm Ürünler Bölümü */}
      <section className="mb-12" aria-label="Tüm Ürünler">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Tüm Ürünler
        </h2>

        {/* Ürün Listesi Grid'i */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* --- KART YAPISI TAM OLARAK BURADA --- */}
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col w-full">
              <Link href={`/product/${product.id}`} className="cursor-pointer">
                <CardHeader>
                  <div className="relative aspect-square w-full overflow-hidden rounded-md">
                    <Image
                      // Küçük görsel (330x330) - Ana sayfa için
                      src={product.thumbnailUrl || product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      // Next.js Image optimizasyonu için boyut ipuçları (330x330 için)
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 330px"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="text-lg font-semibold line-clamp-2 h-[3em]">
                    {" "}
                    {/* Yüksekliği sabitle */}
                    {product.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.category.name}
                  </p>
                </CardContent>
              </Link>
              <CardFooter className="flex justify-between items-center pt-4">
                {" "}
                {/* Üstten boşluk */}
                <span className="text-xl font-bold">
                  {product.price.toFixed(2)} TL
                </span>
                <AddToCartButton product={product} />
              </CardFooter>
            </Card>
          ))}
          {/* -------------------------------------- */}

          {products.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              Listelenecek ürün bulunamadı.
            </p>
          )}
        </div>

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent>
                {/* Önceki */}
                <PaginationItem>
                  <PaginationPrevious
                    href={currentPage > 1 ? `/?page=${currentPage - 1}` : "#"}
                    aria-disabled={currentPage <= 1}
                    tabIndex={currentPage <= 1 ? -1 : undefined}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
                {/* Sayfalar */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/?page=${page}`}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                {/* Sonraki */}
                <PaginationItem>
                  <PaginationNext
                    href={
                      currentPage < totalPages
                        ? `/?page=${currentPage + 1}`
                        : "#"
                    }
                    aria-disabled={currentPage >= totalPages}
                    tabIndex={currentPage >= totalPages ? -1 : undefined}
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
      </main>
    </>
  );
}
