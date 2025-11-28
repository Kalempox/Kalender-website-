import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH: Sipariş durumunu güncelle veya iptal et
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;
    const body = await req.json();
    const { status, reason } = body;

    // Geçerli durum kontrolü
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (status && !validStatuses.includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Siparişi bul
    const order = await db.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // İptal işlemi - sadece admin veya sipariş sahibi yapabilir
    // İptal edildiğinde stokları geri ekle
    if (status === "cancelled" && order.status !== "cancelled") {
      // Kullanıcı kendi siparişini iptal edebilir (pending veya processing durumunda)
      // Admin her zaman iptal edebilir
      const canCancel =
        user.role === "ADMIN" ||
        (order.userId === user.id &&
          (order.status === "pending" || order.status === "processing"));

      if (!canCancel) {
        return new NextResponse(
          "You cannot cancel this order",
          { status: 403 }
        );
      }

      // Stokları geri ekle
      await db.$transaction(async (tx) => {
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        // Sipariş durumunu güncelle
        await tx.order.update({
          where: { id },
          data: {
            status: "cancelled",
            notes: reason
              ? `${order.notes || ""}\n[İptal] ${reason}`.trim()
              : order.notes,
          },
        });
      });

      // İptal edilen siparişi tüm bilgileriyle getir
      const cancelledOrder = await db.order.findUnique({
        where: { id },
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

      return NextResponse.json(cancelledOrder);
    }

    // Durum güncelleme - sadece admin yapabilir
    if (user.role !== "ADMIN") {
      return new NextResponse("Only admins can update order status", {
        status: 403,
      });
    }

    // Durum güncelle
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status,
        notes: reason
          ? `${order.notes || ""}\n[Durum Güncelleme] ${reason}`.trim()
          : order.notes,
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

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[ORDERS_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
