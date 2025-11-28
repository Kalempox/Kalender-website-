// src/app/(admin)/admin/categories/new/page.tsx
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type CategoryFormData = {
  name: string;
  parentId?: string;
  imageUrl?: string;
};

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [mainCategories, setMainCategories] = useState<
    { id: string; name: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>();

  // Ana kategorileri yükle (sadece parentId'si null olanlar)
  useEffect(() => {
    async function loadMainCategories() {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          // Sadece ana kategorileri al (parentId yok)
          const mains = data.filter(
            (cat: { parentId: string | null }) => !cat.parentId
          );
          setMainCategories(mains);
        }
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      }
    }
    loadMainCategories();
  }, []);

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    setError("");

    try {
      if (!data.name) {
        setError("Kategori adı gereklidir");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          parentId: data.parentId || null,
          imageUrl: data.imageUrl || null,
        }),
      });

      if (response.ok) {
        router.push("/admin/categories");
      } else {
        const errorData = await response.text();
        setError(errorData || "Kategori eklenemedi");
      }
    } catch (error) {
      console.error("Kategori ekleme hatası:", error);
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Yeni Kategori Ekle</h1>
          <p className="text-muted-foreground">Yeni bir kategori ekleyin</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kategori Bilgileri</CardTitle>
          <CardDescription>Kategorinin temel bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Kategori Adı *</Label>
              <Input
                id="name"
                {...register("name", { required: "Kategori adı gereklidir" })}
                placeholder="Örn: Gıda"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Ana Kategori (Opsiyonel)</Label>
              <Select
                value={watch("parentId") || ""}
                onValueChange={(value) =>
                  setValue("parentId", value === "none" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ana kategori seçin (boş bırakılırsa ana kategori olur)" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  <SelectItem value="none">
                    Ana Kategori (Alt kategori değil)
                  </SelectItem>
                  {mainCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Görsel URL (Opsiyonel)</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://..."
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Ekleniyor..." : "Kategori Ekle"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/categories">İptal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
