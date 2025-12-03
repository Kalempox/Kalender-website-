import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Kalender Toptan",
  description:
    "Kalender Toptan gizlilik politikası. Kişisel verilerinizin nasıl korunduğunu öğrenin.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <main className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
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
            <Lock className="h-5 w-5" />
            1. Gizliliğiniz Bizim İçin Önemlidir
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Kalender Toptan olarak, kişisel verilerinizin korunması bizim için
            büyük önem taşımaktadır. Bu gizlilik politikası, web sitemizi
            kullanırken topladığımız bilgileri, bu bilgileri nasıl
            kullandığımızı ve paylaştığımızı açıklamaktadır.
          </p>
          <p>
            Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu
            (&quot;KVKK&quot;) ve ilgili mevzuat hükümlerine uygun olarak
            hazırlanmıştır.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            2. Toplanan Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Topladığımız Kişisel Veriler:
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Kimlik Bilgileri:</strong> Ad, soyad, e-posta adresi,
                telefon numarası
              </li>
              <li>
                <strong>Adres Bilgileri:</strong> Teslimat ve fatura adresleri
              </li>
              <li>
                <strong>Ödeme Bilgileri:</strong> Ödeme işlemleri için gerekli
                bilgiler (güvenli ödeme ağ geçitleri aracılığıyla)
              </li>
              <li>
                <strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı türü,
                cihaz bilgileri, çerezler
              </li>
              <li>
                <strong>Kullanım Bilgileri:</strong> Sayfa görüntüleme
                alışkanlıkları, sipariş geçmişi
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            3. Bilgilerin Kullanım Amacı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Topladığımız kişisel verileri aşağıdaki amaçlar için kullanıyoruz:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Siparişlerinizi işleme alma ve teslimat</li>
            <li>Hesabınızı yönetme ve müşteri hizmetleri</li>
            <li>Ödeme işlemlerini gerçekleştirme</li>
            <li>Yasal yükümlülüklerimizi yerine getirme</li>
            <li>Ürün ve hizmetlerimizi geliştirme</li>
            <li>
              Pazarlama ve promosyon faaliyetleri (izin verdiğiniz takdirde)
            </li>
            <li>Güvenlik ve dolandırıcılık önleme</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>4. Bilgilerin Paylaşımı</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Kişisel bilgilerinizi, yasal yükümlülüklerimiz dışında üçüncü
            kişilerle paylaşmıyoruz. Ancak aşağıdaki durumlarda bilgileriniz
            paylaşılabilir:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Ödeme İşlemcileri:</strong> Güvenli ödeme işlemleri için
              ödeme sağlayıcıları
            </li>
            <li>
              <strong>Kargo Firmaları:</strong> Siparişlerinizin teslimatı için
              lojistik firmaları
            </li>
            <li>
              <strong>Hizmet Sağlayıcıları:</strong> Web sitemizin işletilmesi
              için teknik hizmet sağlayıcıları
            </li>
            <li>
              <strong>Yasal Zorunluluklar:</strong> Kanunlar tarafından
              belirtilen durumlarda yetkili makamlara
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>5. Çerezler (Cookies)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler
            kullanılmaktadır. Çerezler hakkında detaylı bilgi için{" "}
            <a
              href="/cerez-politikasi"
              className="text-primary hover:underline"
            >
              Çerez Politikası
            </a>{" "}
            sayfasını inceleyebilirsiniz.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>6. Veri Güvenliği</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Kişisel verilerinizin güvenliğini sağlamak için teknik ve idari
            önlemler almaktayız:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>SSL şifreleme teknolojisi</li>
            <li>Güvenli sunucu altyapısı</li>
            <li>Düzenli güvenlik denetimleri</li>
            <li>Sınırlı erişim kontrolleri</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>7. Haklarınız</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmiş verileriniz hakkında bilgi talep etme</li>
            <li>Kişisel verilerinizin düzeltilmesini isteme</li>
            <li>Kişisel verilerinizin silinmesini isteme</li>
            <li>İşlenen verilerin üçüncü kişilere aktarılmasına itiraz etme</li>
            <li>
              Kişisel verilerin kanuna aykırı işlenmesi nedeniyle zarara uğrama
              halinde zararın giderilmesini talep etme
            </li>
          </ul>
          <p className="mt-4">
            Bu haklarınızı kullanmak için{" "}
            <a
              href="mailto:info@kalenderltd.com"
              className="text-primary hover:underline"
            >
              info@kalenderltd.com
            </a>{" "}
            adresine e-posta gönderebilir veya{" "}
            <a href="/iletisim" className="text-primary hover:underline">
              İletişim
            </a>{" "}
            sayfamızdan bize ulaşabilirsiniz.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>8. İletişim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Gizlilik politikamız hakkında sorularınız için bizimle iletişime
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

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Bu gizlilik politikası zaman zaman güncellenebilir. Güncellemeler
            web sitemizde yayınlandığında geçerlilik kazanır.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
