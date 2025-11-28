"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@prisma/client";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Product;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AddToCartButton({
  product,
  size = "default",
  className,
}: AddToCartButtonProps) {
  const { addToCart, cartItems } = useCart();

  // Sepetteki bu ürünün toplam miktarını bul
  const cartItem = cartItems.find((item) => item.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;
  // Stock alanı optional olabilir (tip güvenliği için)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productStock = (product as any).stock || 0;
  const availableStock = productStock - cartQuantity;

  const isOutOfStock = productStock === 0;
  const isStockLow = availableStock <= 0;

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("Bu ürün stokta yok");
      return;
    }

    if (isStockLow) {
      toast.error("Stokta yeterli ürün yok");
      return;
    }

    addToCart(product, 1);
    toast.success("Ürün sepete eklendi");
  };

  if (isOutOfStock) {
    return (
      <Button size={size} className={className} disabled variant="outline">
        Stokta Yok
      </Button>
    );
  }

  if (isStockLow) {
    return (
      <Button size={size} className={className} disabled variant="outline">
        Stokta Yeterli Yok
      </Button>
    );
  }

  return (
    <Button onClick={handleAdd} size={size} className={className}>
      Sepete Ekle
    </Button>
  );
}
