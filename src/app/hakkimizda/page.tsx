import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Award,
  Users,
  Target,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda | Kalender Toptan",
  description:
    "1962'den beri güvenilir toptan adresiniz. Türkiye genelinde hizmet vermekteyiz.",
};

export default function HakkimizdaPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      {/* Hero Bölümü */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Kalender Toptan</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          1962&apos;den beri Türkiye&apos;nin güvenilir toptan adresi. Doğu ve
          Güneydoğu Anadolu bölgesine kaliteli ürünler ve hızlı teslimat ile
          hizmet vermekteyiz.
        </p>
      </div>

      {/* Hikayemiz */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Hikayemiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <p>
              Kalender Toptan, 1962 yılında kurulmuş, köklü
              bir toptan satış firmasıdır. 60 yılı aşkın deneyimimizle,
              müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunmayı
              hedeflemekteyiz.
            </p>
            <p>
              Türkiye genelinde hizmet veren firmamız, geniş ürün yelpazemiz ve güçlü tedarik ağımızla,
              işletmelerin ihtiyaçlarını karşılamak için çalışmaktayız.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Değerlerimiz */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Değerlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Kalite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ürünlerimizin kalitesi ve güvenilirliği bizim için en önemli
                önceliktir.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Müşteri Memnuniyeti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Müşterilerimizin memnuniyeti tüm çalışmalarımızın merkezindedir.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Hızlı Teslimat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Siparişlerinizi en kısa sürede ve güvenli şekilde teslim etmek
                için çalışıyoruz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Güvenilirlik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                60 yıllık deneyimimiz ve sağlam tedarik ağımızla güvenilir bir
                iş ortağıyız.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Vizyon ve Misyon */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Misyonumuz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">
                İşletmelerin ihtiyaç duyduğu ürünleri en uygun fiyatlarla,
                kaliteli ve güvenilir bir şekilde sunmak. Müşterilerimizin
                başarılarına katkıda bulunmak ve sektörde öncü bir konumda
                olmak.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Vizyonumuz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">
                Türkiye&apos;nin en güvenilir ve tercih edilen toptan satış
                firması olmak. Teknoloji ve yenilikçi yaklaşımlarla sektörde
                lider konumda bulunmak.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hizmet Bölgelerimiz */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <MapPin className="h-8 w-8" />
              Hizmet Bölgelerimiz
            </CardTitle>
            <CardDescription>
              Aşağıdaki illere hızlı ve güvenilir teslimat hizmeti sunmaktayız
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">Türkiye Geneli</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Tüm Bölgeler
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">Hızlı Teslimat</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Tüm Şehirlere
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">Güvenilir Hizmet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Her Zaman
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">Kaliteli Ürünler</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Geniş Yelpaze
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* İletişim Bilgileri */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Phone className="h-8 w-8" />
              İletişim
            </CardTitle>
            <CardDescription>
              Bize ulaşmak için iletişim bilgilerimizi kullanabilirsiniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-1">Adres</h3>
                    <p className="text-muted-foreground">
                      Örnek Mahallesi, Örnek Sokak No: 123
                      <br />
                      Örnek İlçe / Örnek Şehir
                      <br />
                      Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-1">Telefon</h3>
                    <p className="text-muted-foreground">
                      <a
                        href="tel:+905551234567"
                        className="hover:text-primary hover:underline"
                      >
                        +90 555 123 45 67
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-1">E-posta</h3>
                    <p className="text-muted-foreground">
                      <a
                        href="mailto:info@kalenderltd.com"
                        className="hover:text-primary hover:underline"
                      >
                        info@kalenderltd.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Konum Bilgisi */}
              <div className="w-full">
                <h3 className="font-semibold mb-4">Konum</h3>
                <div className="w-full h-96 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                  <p className="text-muted-foreground text-center p-8">
                    Harita bilgisi örnek amaçlıdır.
                    <br />
                    Gerçek konum bilgisi gösterilmemektedir.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
