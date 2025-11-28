// src/app/(admin)/admin/products/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type ProductFormData = {
  name: string;
  description?: string;
  price: string;
  stock: string;
  categoryId: string;
  thumbnailUrl?: string; // Küçük görsel (330x330) - Ana sayfa için
  imageUrl?: string; // Büyük görsel (1650x1650) - Detay sayfası için
  technicalDetails?: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      subCategories: Array<{ id: string; name: string }>;
    }>
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>();

  // Kategorileri yükle (ana kategoriler ve alt kategorileri)
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      }
    }
    loadCategories();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    setError("");

    try {
      // Manuel validasyon
      if (!data.name || !data.price || !data.categoryId) {
        setError("Lütfen tüm gerekli alanları doldurun");
        setLoading(false);
        return;
      }

      const price = parseFloat(data.price);
      if (isNaN(price) || price < 0) {
        setError("Geçerli bir fiyat giriniz");
        setLoading(false);
        return;
      }

      const stock = parseInt(data.stock || "0");
      if (isNaN(stock) || stock < 0) {
        setError("Geçerli bir stok miktarı giriniz (0 veya pozitif sayı)");
        setLoading(false);
        return;
      }

      const payload = {
        ...data,
        price: price,
        stock: stock,
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Ürün eklenemedi");
      }
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Yeni Ürün Ekle</h1>
          <p className="text-muted-foreground">
            Yeni bir ürün ekleyin ve kataloğunuza ekleyin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ürün Bilgileri</CardTitle>
          <CardDescription>Ürünün temel bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ürün Adı *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Örn: Çikolata"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori *</Label>
                <Select
                  onValueChange={(value) => setValue("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ana kategori veya alt kategori seçin" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    {categories.flatMap((category) => [
                      // Ana Kategori
                      <SelectItem key={category.id} value={category.id} className="font-semibold">
                        {category.name}
                      </SelectItem>,
                      // Alt Kategoriler
                      ...(category.subCategories?.map((subCategory) => (
                        <SelectItem
                          key={subCategory.id}
                          value={subCategory.id}
                          className="pl-6 text-sm"
                        >
                          └ {subCategory.name}
                        </SelectItem>
                      )) || []),
                    ])}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Ana kategori veya alt kategori seçebilirsiniz
                </p>
                {errors.categoryId && (
                  <p className="text-sm text-red-600">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Ürün açıklaması..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (TL) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price")}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stok Adedi *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register("stock")}
                  placeholder="0"
                  defaultValue="0"
                />
                {errors.stock && (
                  <p className="text-sm text-red-600">{errors.stock.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Mevcut stok adedini girin
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">
                  Küçük Görsel URL (330x330) *
                </Label>
                <Input
                  id="thumbnailUrl"
                  {...register("thumbnailUrl")}
                  placeholder="https://... (Ana sayfa için)"
                />
                <p className="text-xs text-muted-foreground">
                  Ana sayfa ve ürün listelerinde gösterilecek küçük görsel
                </p>
                {errors.thumbnailUrl && (
                  <p className="text-sm text-red-600">
                    {errors.thumbnailUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">
                  Büyük Görsel URL (1650x1650) *
                </Label>
                <Input
                  id="imageUrl"
                  {...register("imageUrl")}
                  placeholder="https://... (Detay sayfası için)"
                />
                <p className="text-xs text-muted-foreground">
                  Ürün detay sayfasında gösterilecek büyük görsel
                </p>
                {errors.imageUrl && (
                  <p className="text-sm text-red-600">
                    {errors.imageUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicalDetails">Teknik Detaylar</Label>
              <Textarea
                id="technicalDetails"
                {...register("technicalDetails")}
                placeholder="Teknik özellikler..."
                rows={3}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Ekleniyor..." : "Ürün Ekle"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/products">İptal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
