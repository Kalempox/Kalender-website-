// src/app/api/search/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    // 1. URL'den arama sorgusunu ('q') al
    // Örn: /api/search?q=çoko
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return new NextResponse('Arama terimi gerekli', { status: 400 });
    }

    // 2. Veritabanında (Prisma) bu sorguyla eşleşen ürünleri ara
    // PostgreSQL için 'startsWith' daha iyi performans sağlar
    const products = await db.product.findMany({
      where: {
        name: {
          // 'startsWith': "A" ile başlayan ürünler
          startsWith: query,
          // 'insensitive': Büyük/küçük harf duyarsız
          mode: 'insensitive',
        },
      },
      include: {
        category: true, // Kategori bilgisini de getir
      },
      // 3. Çok fazla sonuç dönmemesi için ilk 10 sonucu al
      take: 10,
      orderBy: {
        name: 'asc', // İsme göre sırala
      },
    });

    // 4. Bulunan ürünleri JSON olarak döndür
    return NextResponse.json(products);

  } catch (error) {
    console.error('[SEARCH_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}