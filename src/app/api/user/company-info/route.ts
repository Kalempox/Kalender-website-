// src/app/api/user/company-info/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { companyName, taxId, taxOffice, companyAddress } = body

    // VKN format kontrolü (eğer doldurulmuşsa)
    if (taxId && taxId !== "" && (taxId.length !== 10 || !/^[0-9]+$/.test(taxId))) {
      return new NextResponse(
        'Vergi Kimlik Numarası (VKN) tam olarak 10 haneli olmalıdır',
        { status: 400 }
      )
    }

    // VKN ile başka bir kullanıcıda kullanılıyor mu kontrol et (eğer doldurulmuşsa)
    if (taxId && taxId !== "") {
      const existingTaxId = await db.user.findFirst({
        where: {
          taxId: taxId,
          email: {
            not: session.user.email, // Kendi hesabını hariç tut
          },
        },
      })

      if (existingTaxId) {
        return new NextResponse(
          'Bu Vergi Kimlik Numarası (VKN) başka bir kullanıcı tarafından kullanılıyor',
          { status: 422 }
        )
      }
    }

    // Kullanıcı bilgilerini güncelle
    const updatedUser = await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        companyName: companyName || null,
        taxId: taxId || null,
        taxOffice: taxOffice || null,
        companyAddress: companyAddress || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        companyName: true,
        taxId: true,
        taxOffice: true,
        companyAddress: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('[UPDATE_COMPANY_INFO_ERROR]', error)
    return new NextResponse('Dahili Sunucu Hatası', { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Kullanıcı bilgilerini getir
    const user = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        companyName: true,
        taxId: true,
        taxOffice: true,
        companyAddress: true,
      },
    })

    if (!user) {
      return new NextResponse('Kullanıcı bulunamadı', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('[GET_COMPANY_INFO_ERROR]', error)
    return new NextResponse('Dahili Sunucu Hatası', { status: 500 })
  }
}
