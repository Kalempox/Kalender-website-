// src/app/(admin)/admin/products/[id]/delete/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DeleteProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string>("");
  const [product, setProduct] = useState<{ name: string } | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/admin/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setError("Ürün bulunamadı");
        }
      } catch (error) {
        console.error("Ürün yükleme hatası:", error);
        setError("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz!"
      )
    ) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        const errorData = await response.text();
        setError(errorData || "Ürün silinemedi");
      }
    } catch (error) {
      console.error("Ürün silme hatası:", error);
      setError("Bir hata oluştu");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
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
          <h1 className="text-3xl font-bold">Ürünü Sil</h1>
          <p className="text-muted-foreground">
            Ürünü kalıcı olarak silmek istediğinize emin misiniz?
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ürün Silme Onayı</CardTitle>
          <CardDescription>
            Bu işlem geri alınamaz. Ürün ve tüm ilişkili veriler kalıcı olarak
            silinecektir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {product && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="font-medium">Silinecek Ürün:</p>
              <p className="text-lg">{product.name}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-md">{error}</div>
          )}

          <div className="flex gap-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Siliniyor..." : "Evet, Sil"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/products">İptal</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
