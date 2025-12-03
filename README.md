# Kalender E-Ticaret Projesi

Next.js 15, TypeScript, Prisma ve NextAuth kullanılarak geliştirilmiş modern bir e-ticaret uygulaması.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- PostgreSQL veritabanı
- npm, yarn, pnpm veya bun

### Kurulum

1. **Projeyi klonlayın**
   ```bash
   git clone https://github.com/Kalempox/Kalender-website-.git
   cd Kalender-website-/kalender
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment değişkenlerini yapılandırın**
   ```bash
   cp .env.example .env
   ```
   
   `.env` dosyasını açın ve gerekli değerleri doldurun:
   - `POSTGRES_PRISMA_URL` - PostgreSQL veritabanı bağlantı URL'i
   - `NEXTAUTH_URL` - Uygulama base URL'i (development: `http://localhost:3000`)
   - `NEXTAUTH_SECRET` - NextAuth gizli anahtarı (`openssl rand -base64 32` ile oluşturun)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (Opsiyonel) - Google OAuth
   - `RESEND_API_KEY` (Opsiyonel) - E-posta gönderimi için
   - `ADMIN_EMAIL` (Opsiyonel) - Admin bildirim e-postası

4. **Veritabanını hazırlayın**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

   Tarayıcıda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 📦 Teknolojiler

- **Framework**: Next.js 15 (App Router)
- **Dil**: TypeScript
- **Veritabanı**: PostgreSQL (Prisma ORM)
- **Kimlik Doğrulama**: NextAuth.js
- **UI**: Radix UI, Tailwind CSS
- **Form**: React Hook Form + Zod
- **State**: Zustand

## 🔧 Komutlar

- `npm run dev` - Geliştirme sunucusu
- `npm run build` - Production build
- `npm run start` - Production sunucusu
- `npm run lint` - ESLint kontrolü

## 🗄️ Veritabanı

```bash
npx prisma migrate dev --name migration-adi  # Migration oluştur
npx prisma studio                            # Veritabanı görüntüle
```

## 🚢 Deploy

### Vercel
1. GitHub repository'nizi Vercel'e bağlayın
2. Environment değişkenlerini ekleyin
3. Deploy edin

## 🔒 Güvenlik

- `.env` dosyası **ASLA** git'e commit edilmemelidir
- Tüm hassas bilgiler environment değişkenleri üzerinden kullanılmalıdır
- Kod içinde hardcode edilmiş şifre, API key veya secret bulunmamalıdır

## 📝 Notlar

- E-posta gönderimi development modunda console'a yazdırılır
- Google OAuth opsiyoneldir
- Tüm iletişim bilgileri örnek amaçlıdır

## 📄 Lisans

Bu proje özel bir projedir.
