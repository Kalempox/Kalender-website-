// src/components/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    // DEĞİŞİKLİK: bg-gray-900 yerine bg-black (saf siyah) kullanıldı
    <footer className="bg-black text-gray-400 mt-auto">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Sütun 1: Logo ve Açıklama */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold text-white">Kalender Toptan</h3>
            <p className="text-sm max-w-md">
              1962&apos;den beri güvenilir toptan adresiniz. Türkiye genelinde
              hizmet vermekteyiz.
            </p>
          </div>

          {/* Sütun 2: Şirket Linkleri */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white mb-3">Şirket</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/hakkimizda"
                className="hover:text-white hover:underline"
              >
                Hakkımızda
              </Link>
              <Link
                href="/iletisim"
                className="hover:text-white hover:underline"
              >
                İletişim
              </Link>
            </nav>
          </div>

          {/* Sütun 3: Yasal Linkler */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white mb-3">Yasal</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/mesafeli-satis-sozlesmesi"
                className="hover:text-white hover:underline"
              >
                Mesafeli Satış Sözleşmesi
              </Link>
              <Link
                href="/iptal-ve-iade-politikasi"
                className="hover:text-white hover:underline"
              >
                İptal ve İade Politikası
              </Link>
              <Link
                href="/gizlilik-politikasi"
                className="hover:text-white hover:underline"
              >
                Gizlilik Politikası
              </Link>
              <Link
                href="/kullanim-sartlari"
                className="hover:text-white hover:underline"
              >
                Kullanım Şartları
              </Link>
              <Link
                href="/cerez-politikasi"
                className="hover:text-white hover:underline"
              >
                Çerez Politikası
              </Link>
            </nav>
          </div>

          {/* Sütun 4: İletişim */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white mb-3">
              Bize Ulaşın
            </h4>
            <address className="not-italic space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-gray-400">📍</span>
                <span>
                  Örnek Mahallesi, Örnek Sokak No: 123
                  <br />
                  Örnek İlçe / Örnek Şehir
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">📞</span>
                <a
                  href="tel:+905551234567"
                  className="hover:text-white hover:underline"
                >
                  +90 555 123 45 67
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">✉️</span>
                <a
                  href="mailto:info@kalenderltd.com"
                  className="hover:text-white hover:underline"
                >
                  info@kalenderltd.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Alt Çizgi ve Copyright */}
        {/* DEĞİŞİKLİK: border-gray-700 -> border-gray-800 (siyah üstünde daha iyi görünür) */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Kalender Ltd. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
