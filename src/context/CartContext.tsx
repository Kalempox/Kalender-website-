// src/context/CartContext.tsx
"use client";

import { Product } from "@prisma/client"; // Veritabanı modelimizi tip olarak kullanıyoruz
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

// Sepetteki bir ürünün nasıl görüneceğini tanımlıyoruz
// Artık fiyat, isim gibi bilgileri de tutacak
export interface CartItem extends Product {
  quantity: number;
}

// Context'in hangi verileri ve fonksiyonları sağlayacağını tanımlıyoruz
interface CartContextType {
  cartItems: CartItem[];
  // addToCart artık sadece ID değil, tüm product objesini ve miktarı alacak
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number; // Toplam parça sayısı (3 adet A, 2 adet B = 5)
  totalPrice: number; // SİZİN İSTEĞİNİZ: Toplam Fiyat
}

// Context'i oluşturuyoruz
const CartContext = createContext<CartContextType | undefined>(undefined);

// Context'i kullanmak için özel bir hook (kısayol)
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart, bir CartProvider içinde kullanılmalıdır");
  }
  return context;
}

// Tüm uygulamayı saracak olan Sağlayıcı (Provider) bileşeni
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { status } = useSession();

  // Veritabanından sepeti yükle (sadece giriş yapmış kullanıcılar için)
  const loadCartFromDB = useCallback(async () => {
    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        // Veritabanında sepet varsa onu kullan, yoksa localStorage'dan yükle
        if (data.cartItems && data.cartItems.length > 0) {
          setCartItems(data.cartItems);
          // Veritabanından yüklendi, localStorage'ı da güncelle
          localStorage.setItem("kalender_cart", JSON.stringify(data.cartItems));
        } else {
          // Veritabanında sepet yok, localStorage'dan yükle (yeni giriş yapan kullanıcı için)
          const storedCart = localStorage.getItem("kalender_cart");
          if (storedCart) {
            try {
              const localCart = JSON.parse(storedCart);
              if (localCart.length > 0) {
                setCartItems(localCart);
                // localStorage'daki sepeti veritabanına kaydet
                await fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ cartItems: localCart }),
                });
              }
            } catch (error) {
              console.error("localStorage sepet okuma hatası:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Sepet yüklenirken hata:", error);
      // Hata durumunda localStorage'dan yükle
      const storedCart = localStorage.getItem("kalender_cart");
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (parseError) {
          console.error("localStorage sepet parse hatası:", parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  // Veritabanına sepeti kaydet (sadece giriş yapmış kullanıcılar için)
  const saveCartToDB = useCallback(
    async (items: CartItem[]) => {
      if (status !== "authenticated" || items.length === 0) return;

      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems: items }),
        });
      } catch (error) {
        console.error("Sepet kaydedilirken hata:", error);
      }
    },
    [status]
  );

  // 1. İlk yükleme: Kullanıcı durumuna göre sepeti yükle
  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      // Giriş yapmışsa: Veritabanından yükle (loadCartFromDB localStorage'ı da kontrol eder)
      loadCartFromDB();
    } else {
      // Giriş yapmamışsa: localStorage'dan yükle
      const storedCart = localStorage.getItem("kalender_cart");
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (error) {
          console.error("localStorage sepet okuma hatası:", error);
        }
      }
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // 3. Kullanıcı çıkış yaptığında: localStorage'ı temizle (veritabanındaki sepet korunur)
  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem("kalender_cart");
      setCartItems([]);
    }
  }, [status]);

  // 4. Sepet her değiştiğinde: Hem localStorage hem veritabanına kaydet
  useEffect(() => {
    if (isLoading) return;

    // localStorage'a her zaman kaydet (giriş yapmamış kullanıcılar için)
    localStorage.setItem("kalender_cart", JSON.stringify(cartItems));

    // Giriş yapmışsa veritabanına da kaydet (debounce ile)
    if (status === "authenticated") {
      const timer = setTimeout(() => {
        saveCartToDB(cartItems);
      }, 500); // 500ms bekleyerek gereksiz çağrıları önle

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, status, isLoading]);

  // Sepete Ekle Fonksiyonu (Güncellendi - Stok Kontrolü ile)
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const currentQuantity = existingItem?.quantity || 0;
      const newQuantity = currentQuantity + quantity;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productStock = (product as any).stock || 0;

      // Stok kontrolü
      if (productStock === 0) {
        console.warn("Ürün stokta yok:", product.name);
        return prevItems; // Değişiklik yapma
      }

      if (newQuantity > productStock) {
        console.warn("Stokta yeterli ürün yok:", product.name);
        // Mümkün olduğu kadar ekle (stok adedine kadar)
        const addableQuantity = Math.max(0, productStock - currentQuantity);
        if (addableQuantity === 0) {
          return prevItems; // Değişiklik yapma
        }
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + addableQuantity }
            : item
        );
      }

      if (existingItem) {
        // Ürün zaten varsa, miktarını artır
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Ürün yoksa, sepete yeni ürün olarak ekle (fiyat bilgisiyle!)
        return [...prevItems, { ...product, quantity: quantity }];
      }
    });
  };

  // Sepetten Çıkar Fonksiyonu
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Miktarı Güncelle Fonksiyonu
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          // Stok kontrolü
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const productStock = (item as any).stock || 999999;
          const newQuantity = Math.min(quantity, productStock);

          if (newQuantity !== quantity && quantity > productStock) {
            console.warn(
              "Stokta yeterli ürün yok, maksimum stok adedi kadar eklendi"
            );
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Sepeti Temizle
  const clearCart = () => {
    setCartItems([]);
  };

  // Toplam ürün sayısını (parça) hesapla
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // SİZİN İSTEĞİNİZ: Toplam Fiyatı Hesapla
  // Veritabanına sormuyoruz, state'deki fiyattan hesaplıyoruz (ÇOK HIZLI)
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice, // Toplam fiyatı context'e ekle
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
