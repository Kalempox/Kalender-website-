# Kalender E-Ticaret Projesi

Bu proje, Next.js 15, TypeScript, Prisma ve NextAuth kullanılarak geliştirilmiş modern bir e-ticaret uygulamasıdır.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+ 
- PostgreSQL veritabanı
- npm, yarn, pnpm veya bun (paket yöneticisi)

### Kurulum Adımları

1. **Projeyi klonlayın**
   ```bash
   git clone https://github.com/Kalempox/Kalender-website-.git
   cd Kalender-website-
   cd kalender
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   # veya
   yarn install
   # veya
   pnpm install
   ```

3. **Environment değişkenlerini yapılandırın**
   
   `.env.example` dosyasını `.env` olarak kopyalayın:
   ```bash
   cp .env.example .env
   ```
   
   Windows'ta:
   ```bash
   copy .env.example .env
   ```
   
   Ardından `.env` dosyasını açın ve gerekli değerleri doldurun:
   
   - **POSTGRES_PRISMA_URL**: PostgreSQL veritabanı bağlantı URL'iniz
     - Örnek: `postgresql://kullanici:sifre@localhost:5432/kalender?schema=public`
   
   - **NEXTAUTH_URL**: Uygulamanızın base URL'i
     - Development için: `http://localhost:3000`
     - Production için: `https://www.kalenderltd.com`
   
   - **NEXTAUTH_SECRET**: NextAuth için gizli anahtar
     - Güvenli bir random string oluşturmak için:
       ```bash
       openssl rand -base64 32
       ```
   
   - **GOOGLE_CLIENT_ID** ve **GOOGLE_CLIENT_SECRET** (Opsiyonel)
     - Google OAuth kullanmak istiyorsanız, [Google Cloud Console](https://console.cloud.google.com/)'dan alın
   
   - **RESEND_API_KEY** (Opsiyonel)
     - E-posta gönderimi için [Resend](https://resend.com) API anahtarı
   
   - **ADMIN_EMAIL** (Opsiyonel)
     - Yeni siparişler için bildirim gönderilecek admin e-posta adresi

4. **Veritabanını hazırlayın**
   
   Prisma migration'larını çalıştırın:
   ```bash
   npx prisma migrate dev
   ```
   
   Prisma Client'ı generate edin:
   ```bash
   npx prisma generate
   ```

5. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   # veya
   yarn dev
   # veya
   pnpm dev
   ```

6. **Tarayıcıda açın**
   
   [http://localhost:3000](http://localhost:3000) adresine gidin

## 📦 Kullanılan Teknolojiler

- **Framework**: Next.js 15 (App Router)
- **Dil**: TypeScript
- **Veritabanı**: PostgreSQL (Prisma ORM)
- **Kimlik Doğrulama**: NextAuth.js
- **UI Kütüphanesi**: Radix UI, Tailwind CSS
- **Form Yönetimi**: React Hook Form + Zod
- **State Management**: Zustand
- **E-posta**: Resend (opsiyonel)

## 📁 Proje Yapısı

```
kalender/
├── prisma/
│   └── schema.prisma          # Veritabanı şeması
├── src/
│   ├── app/                   # Next.js App Router sayfaları
│   │   ├── api/              # API route'ları
│   │   ├── (admin)/          # Admin paneli sayfaları
│   │   └── ...               # Diğer sayfalar
│   ├── components/           # React bileşenleri
│   ├── lib/                  # Yardımcı fonksiyonlar
│   └── types/                # TypeScript tip tanımları
├── public/                   # Statik dosyalar
└── .env.example              # Environment değişkenleri örneği
```

## 🔧 Mevcut Komutlar

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run dev:turbo` - Turbopack ile geliştirme sunucusunu başlatır
- `npm run build` - Production build oluşturur
- `npm run start` - Production sunucusunu başlatır
- `npm run lint` - ESLint ile kod kontrolü yapar

## 🗄️ Veritabanı İşlemleri

### Migration oluşturma
```bash
npx prisma migrate dev --name migration-adi
```

### Prisma Studio'yu açma (Veritabanı görüntüleme)
```bash
npx prisma studio
```

### Veritabanı şemasını güncelleme
1. `prisma/schema.prisma` dosyasını düzenleyin
2. Migration oluşturun: `npx prisma migrate dev`
3. Prisma Client'ı güncelleyin: `npx prisma generate`

## 🔐 Environment Değişkenleri

Tüm gerekli environment değişkenleri `.env.example` dosyasında listelenmiştir. Lütfen bu dosyayı `.env` olarak kopyalayıp gerekli değerleri doldurun.

**Zorunlu Değişkenler:**
- `POSTGRES_PRISMA_URL` - Veritabanı bağlantı URL'i
- `NEXTAUTH_URL` - Uygulama base URL'i
- `NEXTAUTH_SECRET` - NextAuth gizli anahtarı

**Opsiyonel Değişkenler:**
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `RESEND_API_KEY` - E-posta gönderimi
- `ADMIN_EMAIL` - Admin bildirim e-postası

## 🚢 Production'a Deploy

### Vercel'e Deploy

1. Projeyi GitHub'a push edin
2. [Vercel](https://vercel.com)'e giriş yapın
3. "New Project" butonuna tıklayın
4. GitHub repository'nizi seçin
5. Environment değişkenlerini ekleyin
6. Deploy butonuna tıklayın

### Environment Değişkenlerini Ayarlama

Vercel dashboard'unda Settings > Environment Variables bölümünden tüm environment değişkenlerini ekleyin.

## 🔒 Güvenlik Notları

**ÖNEMLİ:** Bu projeyi GitHub'a yüklemeden önce aşağıdaki güvenlik kontrollerini yaptığınızdan emin olun:

1. **Environment Değişkenleri:**
   - `.env` dosyası **ASLA** git'e commit edilmemelidir
   - `.gitignore` dosyasında `.env*` kuralı olduğundan emin olun
   - Sadece `.env.example` dosyası commit edilmelidir (gerçek değerler olmadan)

2. **API Key'ler ve Secret'lar:**
   - Kod içinde **hiçbir API key, secret veya şifre** hardcode edilmemelidir
   - Tüm hassas bilgiler environment değişkenleri üzerinden kullanılmalıdır
   - Production'da environment değişkenlerini güvenli bir şekilde yönetin (Vercel, AWS Secrets Manager, vb.)

3. **Kişisel Bilgiler:**
   - Kod içinde gerçek telefon numaraları, adresler veya kişisel bilgiler bulunmamalıdır
   - Tüm iletişim bilgileri örnek/placeholder değerler olmalıdır

4. **Veritabanı:**
   - Production veritabanı bağlantı bilgileri kod içinde bulunmamalıdır
   - Veritabanı şifreleri güçlü ve benzersiz olmalıdır

5. **GitHub'a Push Etmeden Önce:**
   ```bash
   # Tüm değişiklikleri kontrol edin
   git status
   
   # .env dosyasının commit edilmediğinden emin olun
   git diff --cached | grep -i "\.env"
   
   # Hassas bilgileri arayın
   git diff --cached | grep -i "password\|secret\|api.*key\|token"
   ```

## 📝 Notlar

- E-posta gönderimi development modunda console'a yazdırılır. Production'da Resend API key'i gerekir.
- Google OAuth kullanmak istemiyorsanız, ilgili environment değişkenlerini boş bırakabilirsiniz.
- Veritabanı bağlantısı için PostgreSQL'in çalışıyor olması gerekmektedir.
- Bu projede gösterilen tüm iletişim bilgileri (telefon, adres, e-posta) örnek amaçlıdır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje özel bir projedir.

## 📧 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.
