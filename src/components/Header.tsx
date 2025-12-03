"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Searchbar } from "@/components/search/Searchbar";
import { ShoppingCart, User, Menu, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import type { Category } from "@prisma/client";
import { useCart } from "@/context/CartContext";

// --- Tip Tanımları ---
// Prisma'dan gelen Category tipini genişleterek alt kategorileri ve slug'ı ekliyoruz.
interface CategoryWithSub extends Category {
  subCategories: SubCategoryWithSlug[];
  slug: string; // Slug alanı zorunlu
}
interface SubCategoryWithSlug extends Category {
  slug: string; // Slug alanı zorunlu
}

// --- Kategori Menüsü Bileşeni (Mobil/Yan Menü için) ---
function CategoryMenu({
  onSelectMainCategory,
}: {
  onSelectMainCategory: (category: CategoryWithSub | null) => void;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithSub[]>([]);
  const [loading, setLoading] = useState(true);

  // Kategorileri API'den çekme (cache ile optimize edilmiş)
  useEffect(() => {
    async function fetchCategories() {
      try {
        // Cache kontrolü için timestamp ekle
        const response = await fetch("/api/categories", {
          cache: "force-cache", // Browser cache kullan
          next: { revalidate: 300 }, // 5 dakika cache
        });
        if (!response.ok) {
          throw new Error("Kategoriler alınamadı");
        }
        const fetchedData: CategoryWithSub[] = await response.json();
        setCategories(fetchedData);
      } catch (error) {
        console.error("Kategoriler çekilirken hata:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // SEO için href kullanan, ancak navigasyon için router.push kullanan optimize edilmiş linkler
  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    category: CategoryWithSub | null
  ) => {
    e.preventDefault(); // Varsayılan sayfa yenilemesini engelle
    onSelectMainCategory(category); // Header'daki alt navigasyonu güncelle
    router.push(href); // İstemci tarafı navigasyon
  };

  return (
    <nav className="flex flex-col h-full">
      {/* Ana Sayfa / Tümü Linki */}
      <SheetClose asChild>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors mb-2"
          onClick={() => onSelectMainCategory(null)}
        >
          <span>Tümü (Ana Sayfa)</span>
        </Link>
      </SheetClose>

      {/* Scroll edilebilir kategori listesi */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-1">
        {categories.map((category) => (
          <div key={category.id} className="mb-2">
            <SheetClose asChild>
              <a
                href={`/category/${category.slug}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 group"
                onClick={(e) =>
                  handleNav(e, `/category/${category.slug}`, category)
                }
              >
                <span className="flex-1 uppercase tracking-wide">
                  {category.name}
                </span>
                {category.subCategories.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {category.subCategories.length}
                  </span>
                )}
              </a>
            </SheetClose>

            {/* Alt Kategoriler */}
            {category.subCategories.length > 0 && (
              <div className="flex flex-col pl-4 mt-1 space-y-0.5 border-l-2 border-border ml-4">
                {category.subCategories.map((sub) => (
                  <SheetClose asChild key={sub.id}>
                    <a
                      href={`/category/${sub.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={(e) =>
                        handleNav(e, `/category/${sub.slug}`, category)
                      }
                    >
                      <span>{sub.name}</span>
                    </a>
                  </SheetClose>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

// --- Ana Header Bileşeni ---
export function Header() {
  const { data: session, status } = useSession();
  // CategoryMenu'de kullanılmak üzere, şimdilik sadece setter gerekli
  const [, setSelectedMainCategory] = useState<CategoryWithSub | null>(null);
  const pathname = usePathname();
  const { totalPrice, itemCount } = useCart();
  const isAuthPage = pathname === "/auth";

  // Kayan yazı metinleri
  const announcementMessages = [
    " 1962'den Beri Türkiye'nin Toptan Adresi - Kalender ",
    " Profesyonel Hizmet, Uygun Fiyatlar",
    " Türkiye Genelinde Teslimat",
    " Minimum Sipariş: 5.000 TL | 10.000 TL Üzeri Ücretsiz Kargo",
    " Detaylı Bilgi ve Pazarlık İçin İletişime Geçin",
  ];

  // Sayfa değişimlerinde alt navigasyonu yönet
  useEffect(() => {
    if (pathname === "/") {
      setSelectedMainCategory(null);
    }
    // Not: Sayfa yenilendiğinde mevcut kategoriye göre
    // 'selectedMainCategory' set edilirse, alt navigasyon
    // sayfa yenilense bile korunur. (Bu, kategori verisi gerektirir)
  }, [pathname]);

  return (
    <header className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
      {/*
        Kayan Duyuru Şeridi
        CSS animasyonu için <style> bloğu
      */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-content {
          animation: marquee 50s linear infinite;
          display: flex;
          width: fit-content; // İçerik kadar genişlik
        }
      `}</style>
      {!isAuthPage && (
        <div className="bg-gray-900 text-white font-medium overflow-hidden">
          <div className="marquee-content">
            {/* Mesajları 2 kez render et (kesintisiz döngü için) */}
            {[...announcementMessages, ...announcementMessages].map(
              (msg, i) => (
                <span
                  key={i}
                  // İSTEĞİNİZ: Metin boyutu 'text-base' (daha büyük) ve padding (py-2.5) artırıldı.
                  className="px-8 py-2.5 whitespace-nowrap text-base"
                >
                  {msg}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Ana Header İçeriği */}
      <div
        // DÜZELTME: h-100px -> h-[100px] (Tailwind standardı)
        className="w-full flex justify-between items-center h-[100px] px-[1%]"
      >
        {/* Sol Bölüm: Menü + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobil Menü Tetikleyicisi */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[320px] sm:w-[400px] p-0 flex flex-col"
            >
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                  <Menu className="h-5 w-5" />
                  Kategoriler
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-hidden px-6 py-4">
                <CategoryMenu onSelectMainCategory={setSelectedMainCategory} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo (SEO için optimize edilmiş) */}
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setSelectedMainCategory(null)}
          >
            <Image
              src="/logo.png"
              alt="Kalender Logo - Türkiyenin Toptan Adresi" // SEO için önemli
              width={250}
              height={50}
              priority // LCP (Largest Contentful Paint) için önemli
              className="object-contain"
            />
          </Link>
        </div>

        {/* Sağ Bölüm: İkonlar ve Oturum Yönetimi */}
        <div className="flex items-center space-x-4">
          {/* Arama - Searchbar Component */}
          <Searchbar />
          {/* Sepet */}
          <div className="flex flex-col items-center">
            <Button variant="ghost" size="icon" className="h-11 w-11" asChild>
              <Link href="/sepet">
                <ShoppingCart className="h-6 w-6" />
              </Link>
            </Button>
            {itemCount > 0 && (
              <>
                <span className="text-sm font-semibold text-gray-700">
                  {itemCount} ürün
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {totalPrice.toFixed(2)} TL
                </span>
              </>
            )}
          </div>

          {/* Oturum Durumu */}
          {status === "loading" && (
            <div className="h-11 w-11 rounded-full bg-gray-200 animate-pulse" />
          )}
          {status === "unauthenticated" && (
            <Link href="/auth">
              <Button variant="ghost" size="icon" className="h-11 w-11">
                <User className="h-6 w-6" />
              </Button>
            </Link>
          )}
          {status === "authenticated" && session?.user && (
            <>
              <Link
                href="/hesabim"
                className="hidden sm:inline text-base font-medium hover:underline cursor-pointer"
              >
                Hoşgeldiniz, {session.user.name || session.user.email}
              </Link>
              {session.user.role === "ADMIN" && (
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-11 px-6"
                >
                  <Link href="/admin">
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Panel
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="lg"
                onClick={() => signOut()}
                className="h-11 px-6"
              >
                Çıkış Yap
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
