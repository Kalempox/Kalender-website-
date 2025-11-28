// src/components/home/BestsellersCarousel.tsx
import Image from "next/image";
import Link from "next/link";
import type { Product as PrismaProduct } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddToCartButton } from "@/components/AddToCartButton";

interface Product extends PrismaProduct {
  category: {
    name: string;
  };
}

interface BestsellersCarouselProps {
  products: Product[];
}

export function BestsellersCarousel({ products }: BestsellersCarouselProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mb-12" aria-label="En Çok Satanlar">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        En Çok Satanlar
      </h2>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Card className="flex flex-col h-full">
                <Link
                  href={`/product/${product.id}`}
                  className="cursor-pointer"
                >
                  <CardHeader>
                    <div className="relative aspect-square w-full overflow-hidden rounded-md">
                      <Image
                        src={product.thumbnailUrl || product.imageUrl || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 330px"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardTitle className="text-lg font-semibold line-clamp-2 h-[3em]">
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.category.name}
                    </p>
                  </CardContent>
                </Link>
                <CardFooter className="flex justify-between items-center pt-4">
                  <span className="text-xl font-bold">
                    {product.price.toFixed(2)} TL
                  </span>
                  <AddToCartButton product={product} />
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
