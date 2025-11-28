"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, X, Save } from "lucide-react";
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
  user: {
    name: string | null;
    email: string;
  };
}

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

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    async function getParams() {
      const resolved = await params;
      setOrderId(resolved.id);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        // ID ile direkt admin endpoint'ini kullan
        const response = await fetch(`/api/admin/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
          setSelectedStatus(data.status);
        } else {
          toast.error("Sipariş bulunamadı");
          router.push("/admin/orders");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, router]);

  const handleStatusUpdate = async () => {
    if (!order || !orderId) return;

    if (selectedStatus === order.status) {
      toast.info("Durum değişmedi");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        setSelectedStatus(updatedOrder.status);
        toast.success("Sipariş durumu güncellendi");
        // Sayfa yenilemeden güncelle
      } else {
        const error = await response.json();
        toast.error(error.message || "Durum güncellenemedi");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!order || !orderId) return;

    if (
      !confirm(
        "Bu siparişi iptal etmek istediğinizden emin misiniz? Stoklar geri eklenecektir."
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          reason: "Admin tarafından iptal edildi",
        }),
      });

      if (response.ok) {
        // API'den gelen güncellenmiş sipariş bilgisi
        const cancelledOrder = await response.json();
        setOrder(cancelledOrder);
        setSelectedStatus("cancelled");
        toast.success("Sipariş iptal edildi");
        // Sayfa yenilemeden güncelle
      } else {
        const error = await response.json();
        toast.error(error.message || "Sipariş iptal edilemedi");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Sipariş bulunamadı</p>
        <Button asChild className="mt-4">
          <Link href="/admin/orders">Geri Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mt-2">Sipariş Detayları</h1>
        </div>
        <div className="flex gap-2">
          {order.status !== "cancelled" && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              İptal Et
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                Sipariş #{order.orderNumber}
              </CardTitle>
              <CardDescription>{formatDate(order.createdAt)}</CardDescription>
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
          {/* Durum Güncelleme */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Sipariş Durumunu Güncelle</h3>
            <div className="flex gap-2">
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                disabled={saving || order.status === "cancelled"}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={
                  saving ||
                  selectedStatus === order.status ||
                  order.status === "cancelled"
                }
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>

          {/* Müşteri Bilgileri */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Müşteri</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">
                {order.user.name || "İsimsiz"}
              </p>
              <p>{order.user.email}</p>
            </div>
          </div>

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
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Sipariş Detayları</h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
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
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-semibold">Toplam</span>
              <span className="text-2xl font-bold">
                {order.totalPrice.toFixed(2)} TL
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
