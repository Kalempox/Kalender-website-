// src/app/api/cart/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET: Kullanıcının sepetini veritabanından çek
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ cartItems: [] })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ cartItems: [] })
    }

    // CartItem'ları CartContext'in beklediği formata dönüştür
    const cartItems = user.cartItems.map((cartItem) => ({
      ...cartItem.product,
      quantity: cartItem.quantity,
    }))

    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error('[CART_GET]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// POST: Kullanıcının sepetini veritabanına kaydet
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { cartItems } = body

    if (!Array.isArray(cartItems)) {
      return new NextResponse('Invalid cart items', { status: 400 })
    }

    if (cartItems.length === 0) {
      // Boş sepet - sadece mevcut sepeti temizle
      const user = await db.user.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        await db.cartItem.deleteMany({
          where: { userId: user.id }
        })
      }

      return NextResponse.json({ success: true })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Ürün ID'lerini çıkar
    const productIds = cartItems.map((item: { id: string }) => item.id).filter(Boolean)

    if (productIds.length === 0) {
      // Geçerli ürün ID'si yok - sepeti temizle
      await db.cartItem.deleteMany({
        where: { userId: user.id }
      })
      return NextResponse.json({ success: true })
    }

    // Veritabanında bu ürünlerin var olup olmadığını kontrol et
    const existingProducts = await db.product.findMany({
      where: {
        id: { in: productIds }
      },
      select: {
        id: true
      }
    })

    const existingProductIds = new Set(existingProducts.map(p => p.id))

    // Sadece var olan ürünleri filtrele
    const validCartItems = cartItems.filter((item: { id: string; quantity: number }) => {
      return item.id && existingProductIds.has(item.id) && item.quantity > 0
    })

    if (validCartItems.length === 0) {
      // Geçerli ürün yok - sepeti temizle
      await db.cartItem.deleteMany({
        where: { userId: user.id }
      })
      return NextResponse.json({ success: true })
    }

    // Mevcut sepeti temizle
    await db.cartItem.deleteMany({
      where: { userId: user.id }
    })

    // Yeni sepeti ekle - sadece geçerli ürünlerle
    await db.cartItem.createMany({
      data: validCartItems.map((item: { id: string; quantity: number }) => ({
        userId: user.id,
        productId: item.id,
        quantity: item.quantity,
      }))
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CART_POST]', error)
    
    // Foreign key hatası için özel mesaj
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
      return new NextResponse(
        'Sepete eklenmeye çalışılan bazı ürünler bulunamadı',
        { status: 400 }
      )
    }
    
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

