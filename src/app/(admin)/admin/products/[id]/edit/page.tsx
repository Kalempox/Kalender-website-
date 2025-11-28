// src/app/(admin)/admin/products/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import Image from "next/image";

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      subCategories: Array<{ id: string; name: string }>;
    }>
  >([]);
  const [product, setProduct] = useState<ProductFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>();

  // Kategorileri ve ürünü yükle
  useEffect(() => {
    async function loadData() {
      try {
        // Kategorileri yükle
        const categoriesResponse = await fetch("/api/categories");
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        // Ürünü yükle
        const productResponse = await fetch(`/api/admin/products/${productId}`);
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProduct(productData);
          // Form değerlerini set et
          setValue("name", productData.name);
          setValue("description", productData.description || "");
          setValue("price", productData.price.toString());
          setValue("stock", (productData.stock || 0).toString());
          setValue("categoryId", productData.categoryId);
          setValue("thumbnailUrl", productData.thumbnailUrl || "");
          setValue("imageUrl", productData.imageUrl || "");
          setValue("technicalDetails", productData.technicalDetails || "");
        } else {
          setError("Ürün bulunamadı");
        }
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
        setError("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    setError("");

    try {
      if (!data.name || !data.price || !data.categoryId) {
        setError("Lütfen tüm gerekli alanları doldurun");
        setSaving(false);
        return;
      }

      const price = parseFloat(data.price);
      if (isNaN(price) || price < 0) {
        setError("Geçerli bir fiyat giriniz");
        setSaving(false);
        return;
      }

      const stock = parseInt(data.stock || "0");
      if (isNaN(stock) || stock < 0) {
        setError("Geçerli bir stok miktarı giriniz (0 veya pozitif sayı)");
        setSaving(false);
        return;
      }

      const payload = {
        ...data,
        price: price,
        stock: stock,
      };

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Ürün güncellenemedi");
      }
    } catch (error) {
      console.error("Ürün güncelleme hatası:", error);
      setError("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const thumbnailUrl = watch("thumbnailUrl");
  const imageUrl = watch("imageUrl");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Ürün Bulunamadı</h1>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Ürün bulunamadı veya erişim hatası oluştu.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ürünü Düzenle</h1>
          <p className="text-muted-foreground">Ürün bilgilerini güncelleyin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Ürün Bilgileri</CardTitle>
            <CardDescription>
              Ürünün temel bilgilerini güncelleyin
            </CardDescription>
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
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Kategori *</Label>
                  <Select
                    value={watch("categoryId") || ""}
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
                    <p className="text-sm text-red-600">
                      {errors.price.message}
                    </p>
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
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-600">
                      {errors.stock.message}
                    </p>
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
                <Button type="submit" disabled={saving}>
                  {saving ? "Güncelleniyor..." : "Ürünü Güncelle"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/products">İptal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Önizleme */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Küçük Görsel Önizleme (330x330)</CardTitle>
              <CardDescription>
                Ana sayfa ve listelerde görünecek görsel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {thumbnailUrl ? (
                <div className="relative aspect-square w-full max-w-[330px] mx-auto overflow-hidden rounded-md border">
                  <Image
                    src={thumbnailUrl}
                    alt={watch("name") || "Küçük ürün görseli"}
                    fill
                    className="object-cover"
                    sizes="330px"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full max-w-[330px] mx-auto bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Küçük görsel yok</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Büyük Görsel Önizleme (1650x1650)</CardTitle>
              <CardDescription>
                Detay sayfasında görünecek görsel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imageUrl ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-md border">
                  <Image
                    src={imageUrl}
                    alt={watch("name") || "Büyük ürün görseli"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Büyük görsel yok</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
