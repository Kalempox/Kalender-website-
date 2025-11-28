// src/components/home/HeroCarousel.tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import type { Product as PrismaProduct } from "@prisma/client";

interface Product extends PrismaProduct {
  category: {
    name: string;
  };
}

interface HeroCarouselProps {
  products: Product[];
}

interface HeroSlide {
  id: string;
  type: "campaign" | "product";
  product?: Product;
  campaign?: {
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
    buttonText?: string;
  };
}

export function HeroCarousel({ products }: HeroCarouselProps) {
  // Kampanya slide'ları
  const campaignSlides = [
    {
      id: "campaign-1",
      title: "1962'den Beri Türkiye'nin Toptan Adresi",
      description: "Kalender ile kaliteli ürünleri en uygun fiyatlarla bulun",
      imageUrl: "/placeholder.png",
      link: "/",
      buttonText: "Hemen Keşfet",
    },
    {
      id: "campaign-2",
      title: "10.000 TL Üzeri Ücretsiz Kargo",
      description: "10.000 TL ve üzeri siparişlerde teslimat ücretsizdir",
      imageUrl: "/placeholder.png",
      link: "/",
      buttonText: "Sipariş Ver",
    },
    {
      id: "campaign-3",
      title: "Minimum Sipariş 5.000 TL",
      description: "Bölgemizdeki en geniş ürün yelpazesi ile hizmetinizdeyiz",
      imageUrl: "/placeholder.png",
      link: "/",
      buttonText: "Ürünleri İncele",
    },
  ];

  // Ürünleri slide formatına çevir
  const productSlides = products.slice(0, 5).map((product) => ({
    id: `product-${product.id}`,
    type: "product" as const,
    product,
  }));

  // Kampanyaları slide formatına çevir
  const campaignSlideItems = campaignSlides.map((campaign) => ({
    id: campaign.id,
    type: "campaign" as const,
    campaign,
  }));

  // Tüm slide'ları birleştir (kampanyalar + ürünler)
  const allSlides: HeroSlide[] = [...campaignSlideItems, ...productSlides];

  if (allSlides.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full mb-8"
      aria-label="Kampanyalar ve Öne Çıkan Ürünler"
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        className="w-full"
      >
        <CarouselContent>
          {allSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              {slide.type === "campaign" && slide.campaign ? (
                // Kampanya Slide'ı
                <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={slide.campaign.imageUrl}
                    alt={slide.campaign.title}
                    fill
                    className="object-cover"
                    priority={slide.id === "campaign-1"}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
                    <div className="container mx-auto px-4 md:px-8">
                      <div className="max-w-2xl">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
                          {slide.campaign.title}
                        </h2>
                        <p className="text-base md:text-lg lg:text-xl text-white/90 mb-4 md:mb-6">
                          {slide.campaign.description}
                        </p>
                        {slide.campaign.link && (
                          <Button
                            asChild
                            size="lg"
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Link href={slide.campaign.link}>
                              {slide.campaign.buttonText || "Keşfet"}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : slide.type === "product" && slide.product ? (
                // Ürün Slide'ı
                <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={slide.product.thumbnailUrl || slide.product.imageUrl || "/placeholder.png"}
                    alt={slide.product.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
                    <div className="container mx-auto px-4 md:px-8">
                      <div className="max-w-2xl">
                        <p className="text-sm md:text-base text-white/80 mb-2">
                          {slide.product.category.name}
                        </p>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
                          {slide.product.name}
                        </h2>
                        {slide.product.description && (
                          <p className="text-base md:text-lg text-white/90 mb-4 md:mb-6 line-clamp-2">
                            {slide.product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4">
                          <span className="text-3xl md:text-4xl font-bold text-white">
                            {slide.product.price.toFixed(2)} TL
                          </span>
                          <Button
                            asChild
                            size="lg"
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Link href={`/product/${slide.product.id}`}>
                              İncele
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-4" />
        <CarouselNext className="hidden md:flex right-4" />
      </Carousel>
    </section>
  );
}
