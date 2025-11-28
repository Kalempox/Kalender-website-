// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      email,
      name,
      password,
      phone,
      companyName,
      taxId,
      taxOffice,
      companyAddress,
    } = body

    // 1. Gerekli alanlar var mı kontrol et
    if (!email || !password) {
      return new NextResponse('E-posta ve şifre gerekli', { status: 400 })
    }

    // VKN format kontrolü (eğer doldurulmuşsa)
    if (taxId && taxId !== "" && (taxId.length !== 10 || !/^[0-9]+$/.test(taxId))) {
      return new NextResponse(
        'Vergi Kimlik Numarası (VKN) tam olarak 10 haneli olmalıdır',
        { status: 400 }
      )
    }

    // 2. Bu e-posta ile zaten bir kullanıcı var mı kontrol et
    const existingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    })

    if (existingUser) {
      return new NextResponse('Bu e-posta zaten kullanılıyor', { status: 422 })
    }

    // VKN ile de kontrol et (eğer doldurulmuşsa ve aynı VKN'ye sahip başka kullanıcı var mı?)
    if (taxId && taxId !== "") {
      const existingTaxId = await db.user.findFirst({
        where: {
          taxId: taxId,
        },
      })

      if (existingTaxId) {
        return new NextResponse(
          'Bu Vergi Kimlik Numarası (VKN) zaten kayıtlı',
          { status: 422 }
        )
      }
    }

    // 3. Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 12)

    // 4. Doğrulama token'ı oluştur
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 saat geçerli

    // 5. Yeni kullanıcıyı oluştur (e-posta doğrulanmamış) - B2B bilgileri ile
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone: phone || null,
        companyName: companyName || null,
        taxId: taxId || null,
        taxOffice: taxOffice || null,
        companyAddress: companyAddress || null,
        emailVerified: null, // Henüz doğrulanmamış
        emailVerificationTokens: {
          create: {
            token,
            expiresAt,
          },
        },
      },
    })

    // 6. Doğrulama e-postası gönder
    try {
      await sendVerificationEmail(email, token)
    } catch (emailError) {
      console.error('[EMAIL_SEND_ERROR]', emailError)
      // E-posta gönderme hatası kullanıcı oluşturmayı engellemez
    }

    // 7. Başarılı yanıtı döndür (e-posta doğrulama gerekli)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      requiresVerification: true,
    })

  } catch (error) {
    console.error('[REGISTRATION_ERROR]', error)
    return new NextResponse('Dahili Sunucu Hatası', { status: 500 })
  }
}