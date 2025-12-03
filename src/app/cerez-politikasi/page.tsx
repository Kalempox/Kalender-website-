import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, Shield, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Çerez Politikası | Kalender Toptan",
  description:
    "Kalender Toptan web sitesi çerez politikası. Çerezlerin nasıl kullanıldığını öğrenin.",
};

export default function CerezPolitikasiPage() {
  return (
    <main className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Cookie className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Çerez Politikası</h1>
        <p className="text-lg text-muted-foreground">
          Son Güncelleme:{" "}
          {new Date().toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            1. Çerez Nedir?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Çerezler (cookies), web sitemizi ziyaret ettiğinizde tarayıcınızda
            saklanan küçük metin dosyalarıdır. Bu dosyalar, web sitemizin daha
            iyi çalışmasını sağlar ve kullanıcı deneyimini iyileştirir.
          </p>
          <p>
            Çerezler, kişisel olarak tanımlanabilir bilgiler içermez ve
            bilgisayarınıza zarar veremez.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            2. Çerezler Nasıl Kullanılıyor?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Web sitemizde aşağıdaki amaçlar için çerezler kullanılmaktadır:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Zorunlu Çerezler:</strong> Web sitesinin temel
              işlevlerinin çalışması için gerekli
            </li>
            <li>
              <strong>Performans Çerezleri:</strong> Web sitesinin performansını
              analiz etmek ve iyileştirmek için
            </li>
            <li>
              <strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini
              hatırlamak ve kişiselleştirilmiş deneyim sunmak için
            </li>
            <li>
              <strong>Hedefleme Çerezleri:</strong> İlginizi çekebilecek
              içerikleri göstermek için (izin verdiğiniz takdirde)
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            3. Kullandığımız Çerez Türleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Oturum Çerezleri (Session Cookies):
            </h3>
            <p>
              Tarayıcınızı kapattığınızda otomatik olarak silinir. Giriş
              yaptığınızda oturumunuzun açık kalması için kullanılır.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Kalıcı Çerezler (Persistent Cookies):
            </h3>
            <p>
              Belirli bir süre boyunca tarayıcınızda kalır. Dil tercihiniz, tema
              seçiminiz gibi ayarları hatırlamak için kullanılır.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Üçüncü Taraf Çerezleri:
            </h3>
            <p>
              Web analizi, reklam ve sosyal medya entegrasyonları için üçüncü
              taraf hizmetler tarafından kullanılan çerezler.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            4. Çerez Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Çerezlerin kullanımını tarayıcı ayarlarınızdan kontrol
            edebilirsiniz. Ancak bazı çerezleri devre dışı bırakmak, web
            sitesinin bazı özelliklerinin düzgün çalışmamasına neden olabilir.
          </p>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Tarayıcı Ayarları:
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Chrome:</strong> Ayarlar &gt; Gizlilik ve güvenlik &gt;
                Çerezler ve diğer site verileri
              </li>
              <li>
                <strong>Firefox:</strong> Seçenekler &gt; Gizlilik ve Güvenlik
                &gt; Çerezler ve Site Verileri
              </li>
              <li>
                <strong>Safari:</strong> Tercihler &gt; Gizlilik &gt; Çerezleri
                yönet
              </li>
              <li>
                <strong>Edge:</strong> Ayarlar &gt; Gizlilik, arama ve hizmetler
                &gt; Çerezler
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>5. Üçüncü Taraf Hizmetleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Web sitemizde aşağıdaki üçüncü taraf hizmetleri kullanılmaktadır ve
            bunlar kendi çerez politikalarına sahiptir:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Google Analytics:</strong> Web sitesi kullanım
              istatistikleri için
            </li>
            <li>
              <strong>Ödeme Sağlayıcıları:</strong> Güvenli ödeme işlemleri için
            </li>
            <li>
              <strong>Sosyal Medya Platformları:</strong> Sosyal medya
              entegrasyonları için
            </li>
          </ul>
          <p>
            Bu hizmetlerin çerez politikaları için ilgili web sitelerini ziyaret
            edebilirsiniz.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>6. Güncellemeler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Bu çerez politikası zaman zaman güncellenebilir. Güncellemeler web
            sitemizde yayınlandığında geçerlilik kazanır. Önemli değişiklikler
            için sizi bilgilendireceğiz.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. İletişim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Çerez politikamız hakkında sorularınız için bizimle iletişime
            geçebilirsiniz:
          </p>
          <div className="space-y-2">
            <p>
              <strong>E-posta:</strong>{" "}
              <a
                href="mailto:info@kalenderltd.com"
                className="text-primary hover:underline"
              >
                info@kalenderltd.com
              </a>
            </p>
            <p>
              <strong>Telefon:</strong>{" "}
              <a
                href="tel:+905551234567"
                className="text-primary hover:underline"
              >
                +90 555 123 45 67
              </a>
            </p>
            <p>
              <strong>Adres:</strong> Örnek Mahallesi, Örnek Sokak No: 123,
              Şahinbey / Gaziantep
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
