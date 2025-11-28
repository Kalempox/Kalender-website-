// src/app/hesabim/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddressManagement } from "@/components/account/AddressManagement";
import { OrderHistory } from "@/components/account/OrderHistory";
import { ChangePassword } from "@/components/account/ChangePassword";
import { ProfileSettings } from "@/components/account/ProfileSettings";
import { CompanyInfo } from "@/components/account/CompanyInfo";

export default function HesabimPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Hesabım</h1>
        <p className="text-center text-muted-foreground mb-8">
          Hoşgeldiniz, {session.user.name || session.user.email}
        </p>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="company">Bayi Bilgileri</TabsTrigger>
            <TabsTrigger value="addresses">Adreslerim</TabsTrigger>
            <TabsTrigger value="orders">Sipariş Geçmişi</TabsTrigger>
            <TabsTrigger value="password">Şifre Değiştir</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="company" className="mt-6">
            <CompanyInfo />
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Adres Yönetimi</CardTitle>
                <CardDescription>
                  Fatura ve teslimat adreslerinizi buradan yönetebilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddressManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Geçmişi</CardTitle>
                <CardDescription>
                  Geçmiş siparişlerinizi buradan görüntüleyebilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Şifre Değiştir</CardTitle>
                <CardDescription>
                  Hesabınızın şifresini buradan değiştirebilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePassword />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
