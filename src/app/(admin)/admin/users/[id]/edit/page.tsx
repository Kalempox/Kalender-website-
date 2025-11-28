// src/app/(admin)/admin/users/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Shield, User } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type UserFormData = {
  role: string;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    _count: { orders: number };
  } | null>(null);

  const { handleSubmit, setValue, watch } = useForm<UserFormData>();

  // Kullanıcıyı yükle
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setValue("role", userData.role);
        } else {
          setError("Kullanıcı bulunamadı");
        }
      } catch (error) {
        console.error("Kullanıcı yükleme hatası:", error);
        setError("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId, setValue]);

  const onSubmit = async (data: UserFormData) => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: data.role,
        }),
      });

      if (response.ok) {
        router.push("/admin/users");
      } else {
        const errorData = await response.text();
        setError(errorData || "Kullanıcı güncellenemedi");
      }
    } catch (error) {
      console.error("Kullanıcı güncelleme hatası:", error);
      setError("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Kullanıcı Bulunamadı</h1>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentUser = session?.user?.id === userId;
  const currentRole = watch("role");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Kullanıcıyı Düzenle</h1>
          <p className="text-muted-foreground">Kullanıcı rolünü değiştirin</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Bilgileri</CardTitle>
          <CardDescription>Kullanıcının rolünü yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Kullanıcı Bilgileri</Label>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="font-medium">{user.name || "İsimsiz"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Sipariş Sayısı: {user._count.orders}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={currentRole}
                onValueChange={(value) => setValue("role", value)}
                disabled={isCurrentUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Kullanıcı</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {isCurrentUser && (
                <p className="text-sm text-amber-600">
                  Kendi rolünüzü değiştiremezsiniz
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={saving || isCurrentUser}>
                {saving ? "Güncelleniyor..." : "Rolü Güncelle"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/users">İptal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
