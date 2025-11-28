// src/components/home/FeaturedCategories.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  subCategories?: { name: string; slug: string }[];
}

interface FeaturedCategoriesProps {
  categories: Category[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="mb-12" aria-label="Kategoriler">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Kategoriler
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group"
          >
            <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors overflow-hidden">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  ) : (
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {category.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.subCategories &&
                  category.subCategories.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {category.subCategories.length} alt kategori
                    </p>
                  )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
