// src/components/auth/RegisterForm.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Building2, User, Lock } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "./PasswordInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// B2B için genişletilmiş form şeması
const formSchema = z
  .object({
    // Kullanıcı tipi seçimi
    userType: z.enum(["normal", "dealer"], {
      message: "Lütfen bir kullanıcı tipi seçin.",
    }),
    // Bölüm 1: Hesap Bilgileri
    name: z.string().min(2, {
      message: "İsim en az 2 karakter olmalıdır.",
    }),
    email: z.string().email({
      message: "Lütfen geçerli bir e-posta adresi girin.",
    }),
    phone: z
      .string()
      .min(10, {
        message: "Telefon numarası en az 10 haneli olmalıdır.",
      })
      .regex(/^[0-9+\-\s()]+$/, {
        message: "Geçerli bir telefon numarası girin.",
      }),
    password: z
      .string()
      .min(8, {
        message: "Şifre en az 8 karakter olmalıdır.",
      })
      .regex(/[A-Z]/, {
        message: "Şifre en az bir büyük harf içermelidir.",
      })
      .regex(/[a-z]/, {
        message: "Şifre en az bir küçük harf içermelidir.",
      })
      .regex(/[0-9]/, {
        message: "Şifre en az bir rakam içermelidir.",
      }),
    confirmPassword: z.string(),
    // Bölüm 2: Firma Bilgileri (Bayi seçilirse zorunlu)
    companyName: z.string().optional(),
    taxId: z.string().optional(),
    taxOffice: z.string().optional(),
    companyAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Bayi için firma bilgileri zorunlu
    if (data.userType === "dealer") {
      if (!data.companyName || data.companyName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Firma adı en az 2 karakter olmalıdır.",
          path: ["companyName"],
        });
      }
      if (
        !data.taxId ||
        data.taxId === "" ||
        data.taxId.length !== 10 ||
        !/^[0-9]+$/.test(data.taxId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "VKN tam olarak 10 haneli olmalıdır (sadece rakam).",
          path: ["taxId"],
        });
      }
      if (!data.taxOffice || data.taxOffice.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vergi dairesi en az 2 karakter olmalıdır.",
          path: ["taxOffice"],
        });
      }
      if (!data.companyAddress || data.companyAddress.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Firma adresi en az 10 karakter olmalıdır.",
          path: ["companyAddress"],
        });
      }
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "normal",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      taxId: "",
      taxOffice: "",
      companyAddress: "",
    },
    mode: "onBlur", // Anlık hata mesajları için
  });

  const userType = form.watch("userType");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Sadece gerekli alanları al (confirmPassword sadece doğrulama için kullanıldı)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, userType, ...registerData } = values;

      // Normal kullanıcı ise firma bilgilerini gönderme
      if (userType === "normal") {
        delete registerData.companyName;
        delete registerData.taxId;
        delete registerData.taxOffice;
        delete registerData.companyAddress;
      }

      const response = await axios.post("/api/auth/register", registerData);

      if (response.data.requiresVerification) {
        toast.success(
          "Kayıt başarılı! E-posta adresinize doğrulama linki gönderildi."
        );
        router.push(
          "/auth/verify-email?email=" + encodeURIComponent(values.email)
        );
      } else {
        toast.success("Kayıt başarılı! Giriş yapılıyor...");
        // Otomatik giriş
        const signInResult = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        if (signInResult?.ok) {
          router.push("/");
          router.refresh();
        } else {
          router.push("/auth");
        }
      }
    } catch (error: unknown) {
      let errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: string } };
        errorMessage = axiosError.response?.data || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Kullanıcı Tipi Seçimi */}
        <Card>
          <CardHeader>
            <CardTitle>Hesap Tipi Seçin</CardTitle>
            <CardDescription>
              Normal kullanıcı veya bayi hesabı oluşturabilirsiniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="normal" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          <User className="inline h-4 w-4 mr-2" />
                          Normal Kullanıcı
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="dealer" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          <Building2 className="inline h-4 w-4 mr-2" />
                          Bayi Hesabı
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Bölüm 1: Hesap Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Hesap Bilgileri
            </CardTitle>
            <CardDescription>Kişisel bilgilerinizi girin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Soyad *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Adınız Soyadınız"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ornek@kalender.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Bu e-posta adresi giriş yapmak için kullanılacaktır.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cep Telefonu *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    İletişim ve SMS doğrulama için kullanılacaktır.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre *</FormLabel>
                  <FormControl>
                    <PasswordInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="En az 8 karakter, büyük/küçük harf ve rakam içermeli"
                      disabled={isLoading}
                      showStrength={true}
                    />
                  </FormControl>
                  <FormDescription>
                    Şifre en az 8 karakter olmalı ve büyük harf, küçük harf ve
                    rakam içermelidir. (Zorunlu)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre Tekrar *</FormLabel>
                  <FormControl>
                    <PasswordInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Şifrenizi tekrar girin"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Bölüm 2: Firma Bilgileri - Sadece Bayi seçilirse göster */}
        {userType === "dealer" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Firma Bilgileri
              </CardTitle>
              <CardDescription>
                Bayi hesabı için firma bilgilerinizi girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticari Ünvan / Firma Adı *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Örn: Kalender Ltd. Şti."
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vergi Kimlik Numarası (VKN) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234567890"
                        maxLength={10}
                        {...field}
                        disabled={isLoading}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      VKN tam olarak 10 haneli olmalıdır (sadece rakam).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vergi Dairesi *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Örn: Şahinbey Vergi Dairesi"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firma Adresi *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mahalle, Sokak, No, İlçe, İl"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Fatura ve sevkiyat için kullanılacaktır.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="mr-2">Kaydediliyor...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              {userType === "dealer" ? "Bayi Hesabı Oluştur" : "Kayıt Ol"}
            </>
          )}
        </Button>

        {/* Ayırıcı */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              veya
            </span>
          </div>
        </div>

        {/* Google ile Kayıt */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google ile Devam Et
        </Button>
      </form>
    </Form>
  );
}
