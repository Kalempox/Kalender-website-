// src/app/auth/verify-email/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const [email, setEmail] = useState(emailParam || "");
  const [loading, setLoading] = useState(!!token);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);

  const verifyEmail = async (verificationToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/auth/verify-email?token=${verificationToken}`
      );
      const data = await response.json();

      if (response.ok) {
        setVerified(true);
        toast.success("E-posta başarıyla doğrulandı!");
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      } else {
        toast.error(data.message || "Doğrulama başarısız");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Token varsa otomatik doğrula
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const resendVerification = async () => {
    if (!email) {
      toast.error("Lütfen e-posta adresinizi girin");
      return;
    }

    setResending(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Doğrulama linki e-postanıza gönderildi");
      } else {
        toast.error(data.message || "Bir hata oluştu");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>E-posta Doğrulandı</CardTitle>
            <CardDescription>
              Hesabınız aktifleştirildi. Giriş sayfasına yönlendiriliyorsunuz...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth">Giriş Yap</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[400px] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>E-posta Doğrulama</CardTitle>
          <CardDescription>
            Doğrulama linkinizi e-postanıza gönderdik. Lütfen e-postanızı
            kontrol edin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta Adresi</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@kalenderltd.com"
              disabled={resending}
            />
          </div>

          <Button
            onClick={resendVerification}
            className="w-full"
            disabled={resending || !email}
          >
            {resending ? "Gönderiliyor..." : "Doğrulama Linkini Yeniden Gönder"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <Link href="/auth" className="text-primary hover:underline">
              Giriş sayfasına dön
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
