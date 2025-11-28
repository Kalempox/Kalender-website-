// src/app/auth/page.tsx
import { LoginForm } from "@/components/auth/LoginForm"
import { RegisterForm } from "@/components/auth/RegisterForm"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giriş Yap / Bayi Kaydı | Kalender Toptan',
  description:
    'Kalender Toptan B2B hesabınıza giriş yapın veya yeni bayi hesabı oluşturun. Toptan alışveriş için kayıt olun.',
  keywords: [
    'toptan giriş',
    'bayi kaydı',
    'b2b kayıt',
    'toptan hesap',
    'gaziantep toptan',
    'kalender toptan',
  ],
}

export default function AuthPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Kalender Toptan</h1>
            <p className="text-muted-foreground">
              Hesabınıza giriş yapın veya yeni hesap oluşturun
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Hesap İşlemleri</CardTitle>
              <CardDescription className="text-center">
                Hesabınıza giriş yapın veya normal kullanıcı/bayi hesabı oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">

                {/* Sekme Başlıkları */}
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                  <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
                </TabsList>

                {/* Giriş Yap İçeriği */}
                <TabsContent value="login" className="mt-6">
                  <LoginForm />
                </TabsContent>

                {/* Kayıt Ol İçeriği */}
                <TabsContent value="register" className="mt-6">
                  <RegisterForm />
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}