// src/app/api/categories/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCached, setCached } from '@/lib/cache'

export async function GET() {
  try {
    // Cache'den kontrol et
    const cacheKey = 'categories:all'
    const cached = getCached(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Ana kategorileri (parentId'si null olanlar) çek
    // ve her birinin alt kategorilerini de ('include') getir.
    const categories = await db.category.findMany({
      where: { parentId: null },
      include: {
        subCategories: { // Alt kategorileri de getir
          orderBy: { name: 'asc' } // Alt kategorileri de sırala
        }, 
      },
      orderBy: { name: 'asc' } // Ana kategorileri de sırala
    });

    // Cache'e kaydet
    setCached(cacheKey, categories)

    return NextResponse.json(categories);

  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}