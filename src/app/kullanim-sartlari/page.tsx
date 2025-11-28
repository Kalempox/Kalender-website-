import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kullanım Şartları | Kalender Toptan",
  description: "Kalender Toptan web sitesi kullanım şartları ve koşulları.",
};

export default function KullanimSartlariPage() {
  return (
    <main className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <FileText className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Kullanım Şartları</h1>
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
            <AlertCircle className="h-5 w-5" />
            1. Genel Hükümler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Bu kullanım şartları, Kalender Toptan web sitesini
            (www.kalender.com) kullanırken geçerlidir. Web sitemizi kullanarak,
            bu şartları kabul etmiş sayılırsınız.
          </p>
          <p>
            Kalender Toptan, bu şartları önceden haber vermeksizin değiştirme
            hakkını saklı tutar. Değişiklikler web sitemizde yayınlandığı anda
            geçerlilik kazanır.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            2. Hesap Oluşturma ve Kullanım
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Hesap Oluşturma:
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hesap oluştururken doğru ve güncel bilgiler vermelisiniz</li>
              <li>Hesap bilgilerinizin gizliliğinden siz sorumlusunuz</li>
              <li>Hesabınızın yetkisiz kullanımından sorumlu tutulamayız</li>
              <li>Bir hesap için yalnızca bir kullanıcı sorumludur</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            3. Sipariş ve Ödeme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Sipariş Koşulları:
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Siparişleriniz, ürünlerin stokta olması koşuluyla işleme alınır
              </li>
              <li>Fiyatlar ve ürün bilgileri değişiklik gösterebilir</li>
              <li>
                Stok tükendiğinde siparişiniz iptal edilebilir ve ödemeniz iade
                edilir
              </li>
              <li>
                Ödeme işlemleri güvenli ödeme ağ geçitleri üzerinden yapılır
              </li>
              <li>Siparişleriniz ödeme onayı sonrası hazırlanmaya başlanır</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            4. Teslimat ve İade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Teslimat:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Teslimat süreleri sipariş onayından sonra hesaplanır</li>
              <li>
                Teslimat süreleri yaklaşık olarak belirtilir ve taşıyıcı firmaya
                bağlı olarak değişebilir
              </li>
              <li>
                Teslimat adresinizde bulunmamanız durumunda siparişiniz iade
                edilebilir
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-foreground mb-2">
              İade ve İptal:
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Yasal haklarınız saklı kalmak kaydıyla, ürünlerinizi teslimat
                tarihinden itibaren 14 gün içinde iade edebilirsiniz
              </li>
              <li>
                İade edilecek ürünler orijinal ambalajında ve kullanılmamış
                olmalıdır
              </li>
              <li>Kişiselleştirilmiş ürünler iade edilemez</li>
              <li>İade işlemleri için iletişim sayfamızdan bize ulaşın</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            5. Yasaklanan Kullanımlar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Aşağıdaki faaliyetler kesinlikle yasaktır:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Web sitemizin güvenliğini ihlal etmek</li>
            <li>Sahte sipariş vermek veya dolandırıcılık yapmak</li>
            <li>Ürün bilgilerini veya fiyatları yanıltıcı şekilde kullanmak</li>
            <li>Web sitesinin çalışmasını engellemeye çalışmak</li>
            <li>Diğer kullanıcıların hesaplarına erişmeye çalışmak</li>
            <li>Yasalara aykırı içerik paylaşmak</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>6. Fikri Mülkiyet Hakları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Web sitemizdeki tüm içerikler, logolar, markalar ve görseller
            Kalender Toptan&apos;a aittir ve telif hakları ile korunmaktadır. Bu
            içeriklerin izinsiz kullanılması yasaktır.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>7. Sorumluluk Sınırlamaları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Kalender Toptan, web sitesinin kesintisiz veya hatasız çalışmasını
            garanti etmez. Teknik aksaklıklar, güncellemeler veya bakım
            çalışmaları nedeniyle hizmetler geçici olarak kesintiye uğrayabilir.
          </p>
          <p>
            Üçüncü taraf bağlantılar veya içeriklerden sorumlu değiliz.
            Kullanıcılar bu bağlantıları kendi riskleriyle takip ederler.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>8. Değişiklikler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Bu kullanım şartları zaman zaman güncellenebilir. Önemli
            değişiklikler kullanıcılara e-posta veya web sitesi bildirimi ile
            duyurulur.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>9. Uygulanacak Hukuk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Bu kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir.
            Herhangi bir uyuşmazlık durumunda Gaziantep mahkemeleri yetkilidir.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. İletişim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Kullanım şartları hakkında sorularınız için bizimle iletişime
            geçebilirsiniz:
          </p>
          <div className="space-y-2">
            <p>
              <strong>E-posta:</strong>{" "}
              <a
                href="mailto:info@kalender.com"
                className="text-primary hover:underline"
              >
                info@kalender.com
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
