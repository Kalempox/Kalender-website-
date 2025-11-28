// src/app/sepet/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Sepet Beynimiz
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react"; // Sil, Artır, Azalt ikonları
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SepetPage() {
  const { cartItems, removeFromCart, itemCount, totalPrice, updateQuantity } =
    useCart();

  // Sepet boşsa gösterilecek ekran
  if (itemCount === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="text-muted-foreground mb-6">
          Görünüşe göre sepetinize henüz bir şey eklememişsiniz.
        </p>
        <Button asChild>
          <Link href="/">Alışverişe Başla</Link>
        </Button>
      </div>
    );
  }

  // Sepet doluysa gösterilecek ekran
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Sepetim</h1>

      {/* Sepet içeriğini 2 sütunlu yapıda göster (Ürünler + Özet) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sütun 1: Ürün Listesi */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="flex items-center p-4">
              <div className="relative w-24 h-24 rounded-md overflow-hidden mr-4">
                <Image
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <CardTitle className="text-lg font-semibold">
                  {item.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Birim Fiyat: {item.price.toFixed(2)} TL
                </p>
                <p className="text-lg font-bold mt-1">
                  {(item.price * item.quantity).toFixed(2)} TL
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Miktar Kontrolü */}
                <div className="flex items-center gap-2 border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.id, item.quantity - 1);
                      } else {
                        removeFromCart(item.id);
                      }
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 1;
                      if (newQuantity > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const productStock = (item as any).stock || 999999;
                        const finalQuantity = Math.min(
                          newQuantity,
                          productStock
                        );
                        updateQuantity(item.id, finalQuantity);
                        if (newQuantity > productStock) {
                          toast.error(`Maksimum stok: ${productStock} adet`);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value);
                      if (!value || value < 1) {
                        updateQuantity(item.id, 1);
                      }
                    }}
                    className="w-16 h-8 text-center font-semibold px-2"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      // Stok kontrolü
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const productStock = (item as any).stock || 999999;
                      if (item.quantity < productStock) {
                        updateQuantity(item.id, item.quantity + 1);
                      } else {
                        toast.error("Stokta yeterli ürün yok");
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {/* Sil Butonu */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)} // Ürünü sepetten çıkar
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Sütun 2: Sipariş Özeti */}
        <div className="lg:col-span-1">
          <Card className="sticky top-28 p-6">
            {" "}
            {/* Sayfayı kaydırırken takip eder */}
            <CardHeader>
              <CardTitle className="text-2xl">Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Ara Toplam</span>
                <span>{totalPrice.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Kargo</span>
                <span>Hesaplanacak</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-2xl font-bold">
                <span>Toplam</span>
                <span>{totalPrice.toFixed(2)} TL</span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-3">
                <Button
                  size="lg"
                  className="w-full text-lg py-6"
                  disabled={true}
                  title="Ödeme sistemi yakında eklenecek"
                >
                  Ödeme Sistemi Yakında
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Profesyonel ödeme sistemi entegrasyonu için çalışmalarımız
                  devam ediyor. Yakında güvenli ödeme seçenekleriyle
                  hizmetinizde olacağız.
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
