"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Package, Home } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Siparişiniz Alındı!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Siparişiniz başarıyla oluşturuldu. En kısa sürede hazırlanıp size
          ulaştırılacaktır.
        </p>

        {orderNumber && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Package className="h-5 w-5" />
                Sipariş Numarası
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{orderNumber}</p>
              <CardDescription className="mt-2">
                Siparişinizi takip etmek için bu numarayı kullanabilirsiniz
              </CardDescription>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Siparişiniz Hakkında</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            <div>
              <p className="font-semibold mb-2">Sonraki Adımlar:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Siparişiniz onaylandıktan sonra size e-posta gönderilecektir
                </li>
                <li>
                  Siparişinizin durumunu &quot;Hesabım &gt; Sipariş
                  Geçmişi&quot; bölümünden takip edebilirsiniz
                </li>
                <li>Kargo bilgileri hazır olduğunda size iletilecektir</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg">
            <Link href="/hesabim?tab=orders">
              <Package className="h-5 w-5 mr-2" />
              Siparişlerimi Görüntüle
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="h-5 w-5 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SiparisBasariliPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
