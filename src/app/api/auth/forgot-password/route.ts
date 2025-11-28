// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

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
      // Güvenlik: Kullanıcı yoksa da başarılı mesaj dön
      return NextResponse.json({
        success: true,
        message: 'Eğer bu e-posta ile kayıt varsa, şifre sıfırlama linki gönderildi',
      })
    }

    // Eski token'ları sil
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    // Yeni token oluştur
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // 1 saat geçerli

    await db.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    })

    // E-posta gönder
    try {
      await sendPasswordResetEmail(email, token)
    } catch (emailError) {
      console.error('[EMAIL_SEND_ERROR]', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Şifre sıfırlama linki e-postanıza gönderildi',
    })

  } catch (error) {
    console.error('[FORGOT_PASSWORD_ERROR]', error)
    return new NextResponse('Dahili Sunucu Hatası', { status: 500 })
  }
}

