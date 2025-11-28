"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function CheckoutPage() {
  // Ödeme sistemi geçici olarak devre dışı
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Ödeme Sistemi Yakında</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Profesyonel ödeme sistemi entegrasyonu için çalışmalarımız devam
            ediyor. Yakında güvenli ödeme seçenekleriyle hizmetinizde olacağız.
          </p>
        </div>
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">
              Ödeme Sistemi Yakında Eklenecek
            </CardTitle>
            <CardDescription>
              Şu anda ödeme sistemi entegrasyonu için hazırlıklar yapılmaktadır.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <h3 className="font-semibold">Yakında Eklenecek Özellikler:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Güvenli ödeme ağ geçitleri (Iyzico, PayTR, vb.)</li>
                <li>Kredi kartı ve banka kartı ile ödeme</li>
                <li>3D Secure doğrulama</li>
                <li>Banka havalesi / EFT seçeneği</li>
                <li>Kapıda ödeme seçeneği</li>
              </ul>
            </div>
            <div className="pt-4">
              <Button asChild>
                <Link href="/sepet">Sepete Dön</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
