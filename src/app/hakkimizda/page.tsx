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
    "1962'den beri güvenilir toptan adresiniz. Gaziantep, Kahramanmaraş, Adıyaman ve Malatya illerine hizmet vermekteyiz.",
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
              Kalender Toptan, 1962 yılında Gaziantep&apos;te kurulmuş, köklü
              bir toptan satış firmasıdır. 60 yılı aşkın deneyimimizle,
              müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunmayı
              hedeflemekteyiz.
            </p>
            <p>
              Öncelikle Doğu ve Güneydoğu Anadolu bölgesindeki illere hizmet
              veren firmamız, zaman içinde Türkiye geneline hizmet vermeye
              başlamıştır. Geniş ürün yelpazemiz ve güçlü tedarik ağımızla,
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
                <h3 className="font-semibold text-lg">Gaziantep</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Merkez ve Tüm İlçeler
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">Kahramanmaraş</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Merkez ve Tüm İlçeler
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">Adıyaman</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Merkez ve Tüm İlçeler
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">Şanlıurfa</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Merkez ve Tüm İlçeler
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">Malatya</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Merkez ve Tüm İlçeler
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">Elazığ</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Merkez ve Tüm İlçeler
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
                      {/* Buraya gerçek adres bilgisini yazın */}
                      Sanayi Mahallesi,60418 nolu sokak No:91
                      <br />
                      Şehitkamil / Gaziantep
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
                        +90 532 424 95 98
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
                        href="mailto:info@kalender.com"
                        className="hover:text-primary hover:underline"
                      >
                        kalendercafer@hotmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Harita */}
              <div className="w-full">
                <h3 className="font-semibold mb-4">Konum</h3>
                <div className="w-full h-96 rounded-lg overflow-hidden border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.1234567890123!2d37.44093!3d37.08415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDA1JzAyLjkiTiAzN8KwMjYnMjcuNCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <a
                    href="https://www.google.com/maps/place/37°05'02.9%22N+37°26'27.4%22E/@37.0840829,37.4407376,19.25z/data=!4m4!3m3!8m2!3d37.08415!4d37.44093?entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Haritada Aç
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
