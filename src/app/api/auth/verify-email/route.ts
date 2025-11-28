// src/app/api/auth/verify-email/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return new NextResponse('Token gerekli', { status: 400 })
    }

    // Token'ı bul ve süresi dolmuş mu kontrol et
    const verificationToken = await db.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken) {
      return new NextResponse('Geçersiz veya süresi dolmuş token', { status: 400 })
    }

    if (verificationToken.expiresAt < new Date()) {
      // Süresi dolmuş token'ı sil
      await db.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      })
      return new NextResponse('Token süresi dolmuş', { status: 400 })
    }

    // Kullanıcının e-postasını doğrula
    await db.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: new Date(),
      },
    })

    // Token'ı sil (bir kez kullanıldı)
    await db.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    })

    // Tüm eski token'ları temizle (aynı kullanıcı için)
    await db.emailVerificationToken.deleteMany({
      where: {
        userId: verificationToken.userId,
        id: { not: verificationToken.id },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'E-posta başarıyla doğrulandı',
    })

  } catch (error) {
    console.error('[VERIFY_EMAIL_ERROR]', error)
    return new NextResponse('Dahili Sunucu Hatası', { status: 500 })
  }
}

// E-posta yeniden gönderme
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return new NextResponse('E-posta gerekli', { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Güvenlik: Kullanıcı yoksa da başarılı mesaj dön (bilgi sızıntısını önle)
      return NextResponse.json({
        success: true,
        message: 'Eğer bu e-posta ile kayıt varsa, doğrulama linki gönderildi',
      })
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'E-posta zaten doğrulanmış',
      })
    }

    // Eski token'ları sil
    await db.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    })

    // Yeni token oluştur
    const crypto = await import('crypto')
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    await db.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    })

    // E-posta gönder
    const { sendVerificationEmail } = await import('@/lib/email')
    try {
      await sendVerificationEmail(email, token)
    } catch (emailError) {
      console.error('[EMAIL_SEND_ERROR]', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Doğrulama linki e-postanıza gönderildi',
    })

  } catch (error) {
    console.error('[RESEND_VERIFICATION_ERROR]', error)
    return new NextResponse('Dahili Sunucu Hatası', { status: 500 })
  }
}

