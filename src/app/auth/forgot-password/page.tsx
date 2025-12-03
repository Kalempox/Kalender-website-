// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
        toast.success("Şifre sıfırlama linki e-postanıza gönderildi");
      } else {
        toast.error(data.message || "Bir hata oluştu");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/auth">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle className="text-2xl">Şifremi Unuttum</CardTitle>
          </div>
          <CardDescription>
            E-posta adresinize şifre sıfırlama linki göndereceğiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 text-green-800 rounded-md">
                <p className="font-medium">E-posta gönderildi!</p>
                <p className="text-sm mt-1">
                  {email} adresine şifre sıfırlama linki gönderdik. Lütfen
                  e-postanızı kontrol edin.
                </p>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link href="/auth">Giriş sayfasına dön</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@kalenderltd.com"
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Gönderiliyor..." : "Şifre Sıfırlama Linki Gönder"}
              </Button>

              <div className="text-center text-sm">
                <Link href="/auth" className="text-primary hover:underline">
                  Giriş sayfasına dön
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
