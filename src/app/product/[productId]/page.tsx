// src/app/product/[productId]/page.tsx
import { db } from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Metadata } from "next";
import { ProductSchema, BreadcrumbSchema } from "@/components/SEO/StructuredData";
// --- YENİ İMPORTLAR ---
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// -----------------------

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

async function getProduct(id: string) {
  const product = await db.product.findUnique({
    where: { id: id },
    include: { category: true },
  });
  if (!product) notFound();
  return product;
}

// Dinamik Metadata - SEO için çok önemli
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProduct(productId);

  const baseUrl = process.env.NEXTAUTH_URL || "https://kalender.com";
  const productUrl = `${baseUrl}/product/${productId}`;
  const productImage = product.imageUrl
    ? `${baseUrl}${product.imageUrl}`
    : product.thumbnailUrl
    ? `${baseUrl}${product.thumbnailUrl}`
    : `${baseUrl}/placeholder.png`;

  const title = `${product.name} | Toptan ${product.category.name} | Kalender Toptan`;
  const description =
    product.description ||
    `${product.name} - ${product.category.name} kategorisinde kaliteli toptan ürün. En uygun fiyatlarla kalender.com'da!`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category.name,
      "toptan",
      "toptan gıda",
      "toptan alışveriş",
      "gaziantep toptan",
      "kalender",
      "toptan satış",
      "toptan alım satım",
    ],
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: "Kalender Toptan",
      images: [
        {
          url: productImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
) {
  const products = await db.product.findMany({
    where: {
      categoryId: categoryId,
      id: { not: currentProductId },
    },
    include: { category: true },
    take: 8, // Carousel için 4'ten fazla (örn: 8) ürün çekmek daha iyi olur
  });
  return products;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await getProduct(productId);
  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  );

  const baseUrl = process.env.NEXTAUTH_URL || "https://kalender.com";
  const productUrl = `${baseUrl}/product/${productId}`;
  const productImage = product.imageUrl
    ? `${baseUrl}${product.imageUrl}`
    : product.thumbnailUrl
    ? `${baseUrl}${product.thumbnailUrl}`
    : `${baseUrl}/placeholder.png`;

  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.description || `${product.name} - ${product.category.name} kategorisinde kaliteli toptan ürün.`}
        image={productImage}
        price={product.price}
        currency="TRY"
        availability="InStock"
        category={product.category.name}
        url={productUrl}
        brand="Kalender Toptan"
      />
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: baseUrl },
          { name: product.category.name, url: `${baseUrl}/category/${product.category.slug}` },
          { name: product.name, url: productUrl },
        ]}
      />
      <main className="container mx-auto py-12 px-4">
      {/* ÜST BÖLÜM: ÜRÜN DETAYI (Aynı) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={product.imageUrl || product.thumbnailUrl || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <span className="text-sm text-muted-foreground">
            {product.category.name}
          </span>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-lg text-muted-foreground">
            {product.description || "Bu ürün için açıklama girilmemiştir."}
          </p>
          {product.technicalDetails && (
            <div className="pt-4">
              <h3 className="text-lg font-semibold">Ürün Özellikleri</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.technicalDetails}
              </p>
            </div>
          )}
          <div className="flex flex-col space-y-4 pt-4">
            <span className="text-5xl font-extrabold">
              {product.price.toFixed(2)} TL
            </span>
            <AddToCartButton
              product={product}
              size="lg"
              className="text-lg py-6"
            />
          </div>
        </div>
      </div>

      {/* --- ALT BÖLÜM: İLGİLİ ÜRÜNLER (CAROUSEL OLARAK GÜNCELLENDİ) --- */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Beğenebileceğiniz Diğer Ürünler
          </h2>

          <Carousel
            opts={{
              align: "start", // Başlangıca hizala
              loop: true, // Sona gelince başa dön
            }}
            className="w-full"
          >
            <CarouselContent>
              {relatedProducts.map((relatedProduct) => (
                // Her bir kartın genişliğini ayarlıyoruz (responsive)
                <CarouselItem
                  key={relatedProduct.id}
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="p-1">
                    <Card className="flex flex-col h-full">
                      <CardHeader>
                        <div className="relative aspect-square w-full overflow-hidden rounded-md">
                          <Image
                            src={relatedProduct.thumbnailUrl || relatedProduct.imageUrl || "/placeholder.png"}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 330px"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <CardTitle className="text-lg font-semibold line-clamp-2">
                          {relatedProduct.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {relatedProduct.category.name}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-xl font-bold">
                          {relatedProduct.price.toFixed(2)} TL
                        </span>
                        <Button asChild variant="secondary">
                          <Link href={`/product/${relatedProduct.id}`}>
                            İncele
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Sol/Sağ Oklar */}
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      )}
      </main>
    </>
  );
}
