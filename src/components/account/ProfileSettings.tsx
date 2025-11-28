// src/components/account/ProfileSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { Check, User } from "lucide-react";
import { toast } from "sonner";

export function ProfileSettings() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: "",
      });
      // Telefon numarasını API'den çek
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Profil bilgisi yükleme hatası:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Profil bilgileri güncellendi");
        // Session'ı güncelle
        await update();
        await fetchUserProfile();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profil Bilgileri
        </CardTitle>
        <CardDescription>
          Adınız, soyadınız ve telefon numaranızı güncelleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={session?.user?.email || ""}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-muted-foreground">
              E-posta adresiniz değiştirilemez
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Adınız Soyadınız"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon Numarası</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="05XX XXX XX XX"
              pattern="[0-9\s]+"
            />
            <p className="text-xs text-muted-foreground">
              İsteğe bağlı - Sipariş takibi için kullanılır
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Check className="h-4 w-4 mr-2" />
            {loading ? "Güncelleniyor..." : "Profili Güncelle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
