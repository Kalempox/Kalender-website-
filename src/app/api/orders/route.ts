// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email";

// GET: Kullanıcının tüm siparişlerini listele veya sipariş numarası ile ara
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");

    // Sipariş numarası ile arama
    if (orderNumber) {
      const order = await db.order.findFirst({
        where: { orderNumber },
        include: {
          shippingAddress: true,
          billingAddress: true,
          orderItems: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { message: "Sipariş bulunamadı" },
          { status: 404 }
        );
      }

      return NextResponse.json(order);
    }

    // Kullanıcının tüm siparişlerini listele
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        shippingAddress: true,
        billingAddress: true,
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" }, // Son siparişler en üstte
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST: Yeni sipariş oluştur (checkout)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { shippingAddressId, billingAddressId } = body;

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
        addresses: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (!user.cartItems || user.cartItems.length === 0) {
      return new NextResponse("Sepet boş", { status: 400 });
    }

    // Adres kontrolü
    const shippingAddress = user.addresses.find(
      (addr) => addr.id === shippingAddressId && addr.type === "delivery"
    );
    if (!shippingAddress) {
      return new NextResponse("Teslimat adresi bulunamadı", { status: 400 });
    }

    // Fatura adresi kontrolü (varsa)
    let billingAddress = shippingAddress; // Varsayılan olarak teslimat adresi
    if (billingAddressId && billingAddressId !== shippingAddressId) {
      const foundBillingAddress = user.addresses.find(
        (addr) => addr.id === billingAddressId && addr.type === "billing"
      );
      if (foundBillingAddress) {
        billingAddress = foundBillingAddress;
      }
    }

    // Stok kontrolü ve sipariş hazırlığı
    const orderItems: Array<{
      productId: string;
      quantity: number;
      price: number;
    }> = [];
    let totalPrice = 0;

    for (const cartItem of user.cartItems) {
      const product = cartItem.product;

      // Stok kontrolü
      if ((product.stock || 0) < cartItem.quantity) {
        return new NextResponse(
          `${product.name} ürünü için yeterli stok yok (Stok: ${product.stock}, İstenen: ${cartItem.quantity})`,
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        price: product.price,
      });

      totalPrice += product.price * cartItem.quantity;
    }

    // Sipariş numarası oluştur
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Transaction: Sipariş oluştur + Stok düşür + Sepeti temizle
    const order = await db.$transaction(async (tx) => {
      // 1. Siparişi oluştur
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber,
          totalPrice,
          shippingAddressId: shippingAddress.id,
          billingAddressId: billingAddress.id,
          status: "pending",
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          shippingAddress: true,
          billingAddress: true,
          orderItems: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      // 2. Stokları düşür
      for (const orderItem of orderItems) {
        await tx.product.update({
          where: { id: orderItem.productId },
          data: {
            stock: {
              decrement: orderItem.quantity,
            },
          },
        });
      }

      // 3. Sepeti temizle
      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });

      return newOrder;
    });

    // E-posta gönder (hata olursa sipariş yine de kaydedilir)
    try {
      await sendOrderConfirmationEmail(user.email, order);
      await sendAdminOrderNotification(order);
    } catch (emailError) {
      console.error("[ORDER_EMAIL_ERROR]", emailError);
      // E-posta gönderme hatası siparişi engellemez
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

