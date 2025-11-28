"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
  };
}

interface Address {
  fullName: string;
  address: string;
  district?: string | null;
  city: string;
  phone: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  shippingAddress: Address;
  billingAddress?: Address | null;
  orderItems: OrderItem[];
}

function SiparisTakipContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get("orderNumber");

  const [orderNumber, setOrderNumber] = useState(orderNumberParam || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const statusLabels: Record<string, string> = {
    pending: "Beklemede",
    processing: "İşleniyor",
    shipped: "Kargoya Verildi",
    delivered: "Teslim Edildi",
    cancelled: "İptal Edildi",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const searchOrder = async () => {
    if (!orderNumber.trim()) {
      toast.error("Lütfen sipariş numarası girin");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/orders?orderNumber=${orderNumber.trim()}`
      );
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        const error = await response.json();
        toast.error(error.message || "Sipariş bulunamadı");
        setOrder(null);
      }
    } catch (error) {
      console.error("Sipariş arama hatası:", error);
      toast.error("Bir hata oluştu");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;

    if (
      !confirm(
        "Bu siparişi iptal etmek istediğinizden emin misiniz? Stoklar geri eklenecektir."
      )
    ) {
      return;
    }

    setCancelling(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          reason: "Kullanıcı tarafından iptal edildi",
        }),
      });

      if (response.ok) {
        toast.success("Sipariş iptal edildi");
        // Siparişi yeniden yükle - sayfa yenilemeden
        const refreshResponse = await fetch(
          `/api/orders?orderNumber=${order.orderNumber}`
        );
        if (refreshResponse.ok) {
          const refreshedOrder = await refreshResponse.json();
          setOrder(refreshedOrder);
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Sipariş iptal edilemedi");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Bir hata oluştu");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Sayfa yüklendiğinde sipariş numarası varsa ara
  useEffect(() => {
    if (orderNumberParam) {
      searchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumberParam]);

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Sipariş Takibi</h1>
          <p className="text-lg text-muted-foreground">
            Sipariş numaranızı girerek siparişinizin durumunu takip
            edebilirsiniz
          </p>
        </div>

        {/* Arama Formu */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sipariş Numarası ile Ara</CardTitle>
            <CardDescription>
              Sipariş numaranızı girerek sipariş bilgilerinize ulaşın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="orderNumber">Sipariş Numarası</Label>
                <Input
                  id="orderNumber"
                  placeholder="Örn: ORD-1762178486814-SHP7QXK11"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchOrder();
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={searchOrder} disabled={loading} size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Arıyor..." : "Ara"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sipariş Sonucu */}
        {order && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    Sipariş #{order.orderNumber}
                  </CardTitle>
                  <CardDescription>
                    {formatDate(order.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      statusColors[order.status] || statusColors.pending
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                  <span className="text-2xl font-bold">
                    {order.totalPrice.toFixed(2)} TL
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Teslimat Adresi */}
              <div>
                <h3 className="font-semibold mb-2">Teslimat Adresi</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.district &&
                      `${order.shippingAddress.district}, `}
                    {order.shippingAddress.city}
                  </p>
                  <p>Telefon: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Fatura Adresi */}
              {order.billingAddress && (
                <div>
                  <h3 className="font-semibold mb-2">Fatura Adresi</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">
                      {order.billingAddress.fullName}
                    </p>
                    <p>{order.billingAddress.address}</p>
                    <p>
                      {order.billingAddress.district &&
                        `${order.billingAddress.district}, `}
                      {order.billingAddress.city}
                    </p>
                    <p>Telefon: {order.billingAddress.phone}</p>
                  </div>
                </div>
              )}

              {/* Sipariş Ürünleri */}
              <div>
                <h3 className="font-semibold mb-3">Sipariş Detayları</h3>
                <div className="space-y-3">
                  {order.orderItems.map((item: OrderItem) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} adet × {item.price.toFixed(2)} TL
                        </p>
                      </div>
                      <p className="font-semibold">
                        {(item.quantity * item.price).toFixed(2)} TL
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* İptal Butonu */}
              {(order.status === "pending" ||
                order.status === "processing") && (
                <div className="border-t pt-6">
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {cancelling ? "İptal Ediliyor..." : "Siparişi İptal Et"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Bilgi Kartı */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Bilgilendirme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Sipariş numaranızı sipariş onay e-postanızda bulabilirsiniz.
              </p>
              <p>
                • Giriş yaptıysanız, tüm siparişlerinizi{" "}
                <a
                  href="/hesabim?tab=orders"
                  className="text-primary hover:underline"
                >
                  Hesabım &gt; Sipariş Geçmişi
                </a>{" "}
                bölümünden görüntüleyebilirsiniz.
              </p>
              <p>
                • Siparişinizin durumu ile ilgili güncellemeler e-posta ile size
                bildirilecektir.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function SiparisTakipPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
        </div>
      }
    >
      <SiparisTakipContent />
    </Suspense>
  );
}
