// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = body

    if (!token || !password) {
      return new NextResponse('Token ve yeni şifre gerekli', { status: 400 })
    }

    if (password.length < 6) {
      return new NextResponse('Şifre en az 6 karakter olmalıdır', { status: 400 })
    }

    // Token'ı bul ve süresi dolmuş mu kontrol et
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetToken) {
      return new NextResponse('Geçersiz veya süresi dolmuş token', { status: 400 })
    }

    if (resetToken.expiresAt < new Date()) {
      // Süresi dolmuş token'ı sil
      await db.passwordResetToken.delete({
        where: { id: resetToken.id },
      })
      return new NextResponse('Token süresi dolmuş', { status: 400 })
    }

    // Şifreyi hash'le ve güncelle
    const hashedPassword = await bcrypt.hash(password, 12)
    await db.user.update({
      where: { id: resetToken.userId },
      data: {
        password: hashedPassword,
      },
    })

    // Token'ı sil (bir kez kullanıldı)
    await db.passwordResetToken.delete({
      where: { id: resetToken.id },
    })

    // Tüm eski token'ları temizle
    await db.passwordResetToken.deleteMany({
      where: {
        userId: resetToken.userId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Şifre başarıyla değiştirildi',
    })

  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error)
    return new NextResponse('Dahili Sunucu Hatası', { status: 500 })
  }
}

