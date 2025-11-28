// src/components/account/OrderHistory.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl?: string | null;
    category: {
      name: string;
    };
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
  };
  createdAt: string;
  orderItems: OrderItem[];
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

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Sipariş yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Henüz siparişiniz yok</p>
        <p className="text-muted-foreground mb-4">
          İlk siparişinizi vermek için ürünleri keşfedin
        </p>
        <Button asChild>
          <Link href="/">Alışverişe Başla</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  Sipariş #{order.orderNumber}
                </CardTitle>
                <CardDescription>{formatDate(order.createdAt)}</CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[order.status] || statusColors.pending
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
                <span className="text-xl font-bold">
                  {order.totalPrice.toFixed(2)} TL
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Teslimat Adresi */}
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Teslimat Adresi
                </p>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}</p>
              </div>

              {/* Siparişteki Ürünler */}
              <div>
                <p className="font-medium mb-2">Ürünler:</p>
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <span className="text-muted-foreground">
                          ({item.product.category.name})
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {item.quantity} adet × {item.price.toFixed(2)} TL
                        </p>
                        <p className="text-muted-foreground">
                          {(item.quantity * item.price).toFixed(2)} TL
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
