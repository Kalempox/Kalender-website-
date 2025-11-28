import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "İptal ve İade Politikası",
  description: "Kalender Toptan İptal ve İade Politikası",
};

export default function IptalVeIadePolitikasiPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">İptal ve İade Politikası</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Son Güncelleme: {new Date().toLocaleDateString("tr-TR")}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  1. SİPARİŞ İPTALİ
                </h2>
                <h3 className="text-xl font-semibold mb-2">
                  1.1. Sipariş İptali Hakkı
                </h3>
                <p>
                  Müşterilerimiz, siparişlerini teslimat yapılmadan önce iptal
                  edebilirler. Sipariş iptali için aşağıdaki koşullar
                  geçerlidir:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>
                    Sipariş &quot;Beklemede&quot; veya &quot;İşleniyor&quot; durumundayken iptal
                    edilebilir.
                  </li>
                  <li>
                    &quot;Kargoya Verildi&quot; durumundaki siparişler iptal edilemez,
                    ancak iade işlemi başlatılabilir.
                  </li>
                  <li>
                    İptal talebi, müşteri hizmetlerimiz veya hesap paneliniz
                    üzerinden yapılabilir.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">
                  1.2. İptal İşlemi
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    İptal edilen siparişlerin ödemesi, aynı ödeme yöntemi ile
                    3-5 iş günü içinde iade edilir.
                  </li>
                  <li>
                    İptal edilen siparişlerdeki ürünlerin stokları otomatik
                    olarak sisteme geri eklenir.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. İADE</h2>
                <h3 className="text-xl font-semibold mb-2">
                  2.1. Cayma Hakkı
                </h3>
                <p>
                  6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca,
                  müşterilerimiz cayma hakkına sahiptir:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>
                    Ürünün teslim alındığı tarihten itibaren <strong>14 gün</strong> içinde
                    cayma hakkı kullanılabilir.
                  </li>
                  <li>
                    Cayma hakkı, yazılı olarak (e-posta, telefon, hesap paneli)
                    bildirilmelidir.
                  </li>
                  <li>
                    İade edilen ürünler, orijinal ambalajında, hasarsız,
                    kullanılmamış ve etiketleri takılı olmalıdır.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">
                  2.2. İade Edilemeyecek Ürünler
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Müşterinin talebi ile kişiselleştirilmiş ürünler
                  </li>
                  <li>
                    Sağlık ve hijyen açısından iade edilmesi uygun olmayan
                    ürünler
                  </li>
                  <li>
                    Ambalajı açılmış yazılım, CD, DVD gibi ürünler
                  </li>
                  <li>
                    Hızlı bozulabilir veya son kullanma tarihi geçmiş ürünler
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">
                  2.3. İade İşlemi
                </h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    İade talebinizi hesap panelinizden veya müşteri
                    hizmetlerimizden bildirin.
                  </li>
                  <li>
                    İade onayı sonrası, ürünü belirtilen adrese kargo ile
                    gönderin.
                  </li>
                  <li>
                    Ürün kontrolümüzden sonra, ödeme aynı yöntemle 3-5 iş
                    günü içinde iade edilir.
                  </li>
                </ol>

                <h3 className="text-xl font-semibold mb-2 mt-4">
                  2.4. İade Kargo Ücreti
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Ürün hatası veya yanlış ürün gönderimi durumunda kargo
                    ücreti firmamıza aittir.
                  </li>
                  <li>
                    Müşteri kaynaklı iadelerde kargo ücreti müşteriye aittir.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  3. DEĞİŞİM (DEĞİŞTİRME)
                </h2>
                <p>
                  Ürün değişimi, iade işlemi tamamlandıktan sonra yeni ürün
                  siparişi vermeniz şeklinde gerçekleştirilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  4. ARIZALI ÜRÜN İADESİ
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Arızalı ürünler için, ürün teslim alındıktan sonra 30
                    gün içinde bildirim yapılmalıdır.
                  </li>
                  <li>
                    Ürün arızası, kullanım hatasından kaynaklanmıyorsa,
                    kargo ücreti firmamıza aittir.
                  </li>
                  <li>
                    Arızalı ürünler, tamir, değişim veya iade seçeneklerinden
                    biri ile çözümlenir.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  5. İADE ÖDEMESİ
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    İade ödemeleri, ürün kontrolümüzden sonra, aynı ödeme
                    yöntemi ile yapılır.
                  </li>
                  <li>
                    İade süresi, ürünün bize ulaştığı tarihten itibaren 3-5
                    iş günüdür.
                  </li>
                  <li>
                    Banka havalesi ile yapılan ödemelerde, iade süresi banka
                    işlem süresine bağlı olarak uzayabilir.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. İLETİŞİM</h2>
                <p>
                  İptal ve iade işlemleri ile ilgili sorularınız için
                  müşteri hizmetlerimizle iletişime geçebilirsiniz:
                </p>
                <ul className="list-none space-y-2 mt-2">
                  <li>📞 Telefon: [Telefon Numarası]</li>
                  <li>✉️ E-posta: [E-posta Adresi]</li>
                  <li>📍 Adres: [Şirket Adresi]</li>
                </ul>
              </section>

              <section className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Not:</strong> Bu politika, hukuk danışmanınız
                  tarafından gözden geçirilmeli ve şirketinize özel olarak
                  düzenlenmelidir. Yukarıdaki metin bir şablon olup, yasal
                  bağlayıcılığı için hukuk danışmanı ile görüşülmelidir.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

