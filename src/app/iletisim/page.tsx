import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim | Kalender Toptan",
  description:
    "Bizimle iletişime geçin. Sorularınız, önerileriniz veya sipariş talepleriniz için bize ulaşın.",
};

export default function IletisimPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">İletişim</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sorularınız, önerileriniz veya sipariş talepleriniz için bizimle
          iletişime geçebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Sütun: İletişim Formu */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Bize Yazın</CardTitle>
              <CardDescription>
                İletişim formunu doldurarak bize ulaşabilirsiniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad *</Label>
                    <Input id="name" placeholder="Adınız Soyadınız" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" type="tel" placeholder="05XX XXX XX XX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Konu *</Label>
                  <Input id="subject" placeholder="İletişim nedeni" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mesajınız *</Label>
                  <Textarea
                    id="message"
                    placeholder="Mesajınızı buraya yazın..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Mesajı Gönder
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Form gönderimi yakında aktif olacaktır. Şimdilik lütfen
                  telefon veya e-posta ile iletişime geçin.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Sütun: İletişim Bilgileri ve Harita */}
        <div className="lg:col-span-1 space-y-6">
          {/* İletişim Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Adres</h3>
                  <p className="text-sm text-muted-foreground">
                    Sanayi Mahallesi,60418 nolu sokak No:91
                    <br />
                    Şehitkamil / Gaziantep
                    <br />
                    Türkiye
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Telefon</h3>
                  <p className="text-sm text-muted-foreground">
                    <a
                      href="tel:+905551234567"
                      className="hover:text-primary hover:underline"
                    >
                      +90 532 424 95 98
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">E-posta</h3>
                  <p className="text-sm text-muted-foreground">
                    <a
                      href="mailto:info@kalender.com"
                      className="hover:text-primary hover:underline"
                    >
                      kalendercafer@hotmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
                  <p className="text-sm text-muted-foreground">
                    Pazartesi - Cumartesi: 09:00 - 18:00
                    <br />
                    Pazar: Kapalı
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Harita */}
          <Card>
            <CardHeader>
              <CardTitle>Konumumuz</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 rounded-lg overflow-hidden border">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
