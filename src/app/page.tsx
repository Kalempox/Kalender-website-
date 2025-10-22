// src/app/page.tsx
import type { Metadata } from 'next'
import { Button } from "@/components/ui/button" 

export const metadata: Metadata = {
  title: 'Ana Sayfa', 
  description: 'Kalender Toptan Adresi ana sayfası...',
}

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold text-blue-600">
        Merhaba Dünya! Sitemize Hoş Geldiniz.
      </h1>
      <p className="mt-4 text-lg">
        Bu benim SEO uyumlu, özel Next.js sitemin ana sayfası.
      </p>

      {/* <-- 2. YENİ SATIR (Kullanım) --> */}
      <Button className="mt-8">
        Bu Benim Yeni Butonum!
      </Button>

    </main>
  );
}