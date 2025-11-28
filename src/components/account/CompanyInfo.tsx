// src/components/account/CompanyInfo.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Building2, Loader2 } from "lucide-react";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const companyInfoSchema = z.object({
  companyName: z
    .string()
    .min(2, {
      message: "Firma adı en az 2 karakter olmalıdır.",
    })
    .optional()
    .or(z.literal("")),
  taxId: z
    .string()
    .refine(
      (val) => {
        if (!val || val === "") return true; // Boşsa geçerli
        return val.length === 10 && /^[0-9]+$/.test(val);
      },
      {
        message: "VKN tam olarak 10 haneli olmalıdır (sadece rakam).",
      }
    )
    .optional()
    .or(z.literal("")),
  taxOffice: z
    .string()
    .min(2, {
      message: "Vergi dairesi en az 2 karakter olmalıdır.",
    })
    .optional()
    .or(z.literal("")),
  companyAddress: z
    .string()
    .min(10, {
      message: "Firma adresi en az 10 karakter olmalıdır.",
    })
    .optional()
    .or(z.literal("")),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;

export function CompanyInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: "",
      taxId: "",
      taxOffice: "",
      companyAddress: "",
    },
    mode: "onBlur",
  });

  // Mevcut bilgileri yükle
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await axios.get("/api/user/company-info");
        const data = response.data;

        form.reset({
          companyName: data.companyName || "",
          taxId: data.taxId || "",
          taxOffice: data.taxOffice || "",
          companyAddress: data.companyAddress || "",
        });
      } catch (error) {
        console.error("Firma bilgileri yüklenirken hata:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCompanyInfo();
  }, [form]);

  const onSubmit = async (values: CompanyInfoFormValues) => {
    setIsLoading(true);

    try {
      // Boş string'leri null'a çevir
      const dataToSend = {
        companyName: values.companyName?.trim() || null,
        taxId: values.taxId?.trim() || null,
        taxOffice: values.taxOffice?.trim() || null,
        companyAddress: values.companyAddress?.trim() || null,
      };

      await axios.patch("/api/user/company-info", dataToSend);

      toast.success("Firma bilgileri başarıyla güncellendi!");
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

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bayi Bilgileri
          </CardTitle>
          <CardDescription>
            Firma bilgilerinizi buradan güncelleyebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Bayi Bilgileri
        </CardTitle>
        <CardDescription>
          Firma bilgilerinizi buradan güncelleyebilirsiniz. (Tüm alanlar opsiyoneldir)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticari Ünvan / Firma Adı</FormLabel>
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
                  <FormLabel>Vergi Kimlik Numarası (VKN)</FormLabel>
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
                  <FormLabel>Vergi Dairesi</FormLabel>
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
                  <FormLabel>Firma Adresi</FormLabel>
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

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                "Bilgileri Güncelle"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
