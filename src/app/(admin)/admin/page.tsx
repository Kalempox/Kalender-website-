// src/app/(admin)/admin/page.tsx
import React from "react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users } from "lucide-react";
import { RevenueCard } from "@/components/admin/RevenueCard";

export default async function AdminDashboard() {
  // Dashboard istatistikleri
  const [productCount, orderCount, userCount, totalRevenue] = await Promise.all(
    [
      db.product.count(),
      db.order.count(),
      db.user.count(),
      db.order.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          status: {
            not: "cancelled",
          },
        },
      }),
    ]
  );

  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const stats = [
    {
      title: "Toplam Ürün",
      value: productCount,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Toplam Sipariş",
      value: orderCount,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Toplam Kullanıcı",
      value: userCount,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Toplam Ciro",
      value: totalRevenue._sum.totalPrice || 0,
      color: "text-orange-600",
      format: "currency",
      isRevenue: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Hoşgeldiniz, admin paneline hoş geldiniz
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          if (stat.isRevenue) {
            return (
              <RevenueCard
                key={stat.title}
                baseRevenue={stat.value as number}
              />
            );
          }
          const Icon = stat.icon as React.ComponentType<{ className?: string }>;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.format === "currency"
                    ? `${(stat.value as number).toFixed(2)} TL`
                    : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Son Siparişler */}
      <Card>
        <CardHeader>
          <CardTitle>Son Siparişler</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">Sipariş #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user.name || order.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {order.totalPrice.toFixed(2)} TL
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status === "pending"
                        ? "Beklemede"
                        : order.status === "processing"
                        ? "İşleniyor"
                        : order.status === "delivered"
                        ? "Teslim Edildi"
                        : order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Henüz sipariş bulunmuyor
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
