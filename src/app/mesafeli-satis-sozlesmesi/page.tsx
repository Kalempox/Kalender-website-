import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "Kalender Toptan Mesafeli Satış Sözleşmesi",
};

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              Mesafeli Satış Sözleşmesi
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Son Güncelleme: {new Date().toLocaleDateString("tr-TR")}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. TARAFLAR</h2>
                <p>
                  Bu mesafeli satış sözleşmesi (bundan sonra &quot;Sözleşme&quot; olarak
                  anılacaktır), aşağıdaki taraflar arasında aşağıda belirtilen
                  hüküm ve şartlar çerçevesinde imzalanmıştır.
                </p>
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>SATICI:</strong>
                  </p>
                  <p>Kalender Ltd. Şti.</p>
                  <p>Adres: [Şirket Adresi]</p>
                  <p>Telefon: [Telefon Numarası]</p>
                  <p>E-posta: [E-posta Adresi]</p>
                  <p>Vergi Dairesi: [Vergi Dairesi]</p>
                  <p>Vergi No: [Vergi Numarası]</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  2. KONU VE KAPSAM
                </h2>
                <p>
                  Bu sözleşme, SATICI&apos;nın internet sitesi üzerinden sunduğu
                  ürünlerin satışı ve teslimi ile ilgili tarafların hak ve
                  yükümlülüklerini düzenlemektedir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  3. SİPARİŞ VE ÖDEME
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Müşteri, internet sitesi üzerinden sipariş vererek
                    ürünleri satın alabilir.
                  </li>
                  <li>
                    Sipariş onayı, SATICI tarafından müşteriye e-posta ile
                    bildirilir.
                  </li>
                  <li>
                    Ödeme, sipariş sırasında belirtilen ödeme yöntemleri ile
                    yapılır.
                  </li>
                  <li>
                    Fiyatlar, sipariş sırasında belirtilen fiyatlardır ve
                    KDV dahildir.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. TESLİMAT</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Ürünler, sipariş sırasında belirtilen teslimat adresine
                    gönderilir.
                  </li>
                  <li>
                    Teslimat süresi, sipariş onayından itibaren [X] iş günü
                    içerisindedir.
                  </li>
                  <li>
                    Kargo ücreti, sipariş tutarına göre belirlenir ve
                    müşteriye aittir.
                  </li>
                  <li>
                    Teslimat sırasında ürünlerin kontrolünü yapmak müşterinin
                    sorumluluğundadır.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  5. CAYMA HAKKI
                </h2>
                <p>
                  Müşteri, 6502 sayılı Tüketicinin Korunması Hakkında Kanun
                  uyarınca, sözleşmeden cayma hakkına sahiptir.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>
                    Cayma hakkı, ürünün teslim alındığı tarihten itibaren 14
                    gün içinde kullanılabilir.
                  </li>
                  <li>
                    Cayma hakkının kullanılması için SATICI&apos;ya yazılı olarak
                    bildirim yapılması gerekir.
                  </li>
                  <li>
                    İade edilen ürünlerin orijinal ambalajında, hasarsız ve
                    kullanılmamış olması gerekir.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. GARANTİ</h2>
                <p>
                  Ürünler, yasal garantili olarak satılmaktadır. Garanti
                  koşulları, ürün kategorisine göre değişiklik gösterebilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  7. GİZLİLİK VE KİŞİSEL VERİLER
                </h2>
                <p>
                  SATICI, müşteri bilgilerini 6698 sayılı Kişisel Verilerin
                  Korunması Kanunu&apos;na uygun olarak işler ve korur. Detaylı
                  bilgi için{" "}
                  <a
                    href="/gizlilik-politikasi"
                    className="text-primary hover:underline"
                  >
                    Gizlilik Politikası
                  </a>{" "}
                  sayfasını inceleyebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  8. UYUŞMAZLIK ÇÖZÜMÜ
                </h2>
                <p>
                  Bu sözleşmeden doğan uyuşmazlıkların çözümünde Türk Hukuku
                  uygulanır. İstanbul Tüketici Hakem Heyeti ve Tüketici
                  Mahkemeleri yetkilidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  9. DİĞER HÜKÜMLER
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Bu sözleşme, internet sitesi üzerinden kabul edilerek
                    onaylanır.
                  </li>
                  <li>
                    SATICI, sözleşme hükümlerini tek taraflı olarak
                    değiştirme hakkını saklı tutar.
                  </li>
                  <li>
                    Değişiklikler, internet sitesinde yayınlandığı tarihten
                    itibaren geçerlidir.
                  </li>
                </ul>
              </section>

              <section className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Not:</strong> Bu sözleşme, hukuk danışmanınız tarafından
                  gözden geçirilmeli ve şirketinize özel olarak
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

