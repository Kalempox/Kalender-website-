// src/lib/auth.ts
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

// NextAuth yapılandırması
export const authOptions: NextAuthOptions = {
  // Prisma adaptörünü veritabanımıza bağlıyoruz
  adapter: PrismaAdapter(db),

  // Kullanacağımız giriş "sağlayıcıları"
  providers: [
    // Google ile giriş
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Biz "E-posta ve Şifre" ile girişi (Credentials) kullanacağız
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "text" },
        password: { label: "Şifre", type: "password" },
      },

      // "Giriş Yap" butonuna basıldığında bu fonksiyon çalışacak
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gerekli.")
        }

        // 1. Veritabanında kullanıcıyı bul
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        // 2. Kullanıcı yoksa veya şifresi kayıtlı değilse (örn: Google ile girdiyse)
        if (!user || !user.password) {
          throw new Error("Kullanıcı bulunamadı.")
        }

        // 3. E-posta doğrulanmış mı kontrol et (sadece e-posta/şifre ile giriş için, Google ile giriş için gerekmez)
        // Not: Google ile giriş yapan kullanıcıların emailVerified alanı otomatik olarak set edilir
        // Bu kontrolü sadece e-posta/şifre ile giriş yapan kullanıcılar için yapıyoruz
        if (!user.emailVerified && user.password) {
          throw new Error("E-postanızı doğrulamanız gerekiyor. Lütfen e-postanızı kontrol edin.")
        }

        // 3. Veritabanındaki şifrelenmiş şifre ile kullanıcının girdiği şifreyi karşılaştır
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordCorrect) {
          throw new Error("Hatalı şifre.")
        }

        // 4. Şifre doğruysa, kullanıcı objesini döndür ve oturum başlasın
        return user
      },
    }),
  ],

  // Oturum (session) stratejisi. JWT (JSON Web Token) kullanacağız.
  session: {
    strategy: "jwt",
  },

  // JWT callback - role bilgisini session'a ekle
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as { role?: string }).role || "USER";
      }
      // Session güncelleme desteği
      if (trigger === "update" && session) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "USER";
        session.user.name = token.name as string | null;
      }
      return session;
    },
  },

  // Gizli anahtar (JWT'leri imzalamak için)
  secret: process.env.NEXTAUTH_SECRET,

  // Hata ayıklama (debug)
  debug: process.env.NODE_ENV === "development",
}

