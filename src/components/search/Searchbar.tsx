// src/components/search/Searchbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import type { Product } from "@prisma/client";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// API'den gelen ürün tipi (category bilgisiyle)
interface ProductWithCategory extends Product {
  category?: {
    id: string;
    name: string;
  };
}

export function Searchbar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(""); // Kullanıcının yazdığı metin
  const [debouncedQuery] = useDebounce(query, 300); // 300ms gecikmeli metin
  const [results, setResults] = useState<ProductWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // 1. Kullanıcı yazmayı bıraktığında (debouncedQuery değiştiğinde) API'yi çağır
  useEffect(() => {
    if (debouncedQuery.length > 0) {
      setIsLoading(true);
      async function fetchResults() {
        try {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(debouncedQuery)}`
          );
          if (response.ok) {
            const data = await response.json();
            setResults(data);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.error("Arama hatası:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }
      fetchResults();
    } else {
      setResults([]); // Sorgu boşsa sonuçları temizle
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  // 2. Dışarı tıklanınca dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Bir sonuca tıklandığında
  const handleSelect = (productId: string) => {
    router.push(`/product/${productId}`);
    setQuery(""); // Sorguyu temizle
    setResults([]); // Sonuçları temizle
    setIsFocused(false); // Focus'u kapat
  };

  // 4. Temizle butonu
  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const showResults = isFocused && (query.length > 0 || results.length > 0);

  return (
    <div
      ref={containerRef}
      className="relative w-full md:w-[200px] lg:w-[300px]"
    >
      {/* Arama Input'u */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Ürün ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-10 pr-10 w-full"
        />
        {query.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sonuçlar Dropdown'ı */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[400px] overflow-hidden rounded-md border bg-popover shadow-lg">
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Aranıyor...
              </div>
            )}
            {!isLoading && results.length === 0 && query.length > 0 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Sonuç bulunamadı.
              </div>
            )}
            {!isLoading && results.length > 0 && (
              <>
                <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
                  {results.length} ürün bulundu
                </div>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                    className="w-full px-4 py-3 text-left hover:bg-accent focus:bg-accent focus:outline-none transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm truncate">
                        {product.name}
                      </span>
                      {product.category && (
                        <span className="text-xs text-muted-foreground">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
