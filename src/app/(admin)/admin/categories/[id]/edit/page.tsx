// src/app/(admin)/admin/categories/[id]/edit/page.tsx
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type CategoryFormData = {
  name: string;
  parentId?: string;
  imageUrl?: string;
};

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [mainCategories, setMainCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [category, setCategory] = useState<CategoryFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>();

  // Kategorileri ve kategoriyi yükle
  useEffect(() => {
    async function loadData() {
      try {
        // Ana kategorileri yükle
        const categoriesResponse = await fetch("/api/categories");
        if (categoriesResponse.ok) {
          const data = await categoriesResponse.json();
          const mains = data.filter(
            (cat: { parentId: string | null }) => !cat.parentId
          );
          // Düzenlenen kategoriyi hariç tut
          setMainCategories(
            mains.filter((cat: { id: string }) => cat.id !== categoryId)
          );
        }

        // Kategoriyi yükle
        const categoryResponse = await fetch(
          `/api/admin/categories/${categoryId}`
        );
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          setCategory(categoryData);
          setValue("name", categoryData.name);
          setValue("parentId", categoryData.parentId || "");
          setValue("imageUrl", categoryData.imageUrl || "");
        } else {
          setError("Kategori bulunamadı");
        }
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
        setError("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId, setValue]);

  const onSubmit = async (data: CategoryFormData) => {
    setSaving(true);
    setError("");

    try {
      if (!data.name) {
        setError("Kategori adı gereklidir");
        setSaving(false);
        return;
      }

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
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
        setError(errorData || "Kategori güncellenemedi");
      }
    } catch (error) {
      console.error("Kategori güncelleme hatası:", error);
      setError("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const imageUrl = watch("imageUrl");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Kategori Bulunamadı</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Kategoriyi Düzenle</h1>
          <p className="text-muted-foreground">
            Kategori bilgilerini güncelleyin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Kategori Bilgileri</CardTitle>
            <CardDescription>
              Kategorinin temel bilgilerini güncelleyin
            </CardDescription>
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
                    setValue("parentId", value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ana kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      Ana Kategori (Alt kategori değil)
                    </SelectItem>
                    {mainCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
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
                <Button type="submit" disabled={saving}>
                  {saving ? "Güncelleniyor..." : "Kategoriyi Güncelle"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/categories">İptal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Önizleme */}
        <Card>
          <CardHeader>
            <CardTitle>Görsel Önizleme</CardTitle>
            <CardDescription>
              Kategori görselinin nasıl görüneceğini buradan kontrol edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-md border">
                <Image
                  src={imageUrl}
                  alt={watch("name") || "Kategori görseli"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Görsel yok</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
