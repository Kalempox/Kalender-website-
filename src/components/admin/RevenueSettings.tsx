"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function RevenueSettings() {
  const [offset, setOffset] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [newOffset, setNewOffset] = useState<string>("");

  useEffect(() => {
    // localStorage'dan offset değerini yükle
    const savedOffset = localStorage.getItem("revenue_offset");
    if (savedOffset) {
      setOffset(parseFloat(savedOffset));
    }
  }, []);

  const handleSetOffset = () => {
    const value = parseFloat(newOffset);
    if (isNaN(value)) {
      toast.error("Geçerli bir sayı girin");
      return;
    }

    localStorage.setItem("revenue_offset", value.toString());
    setOffset(value);
    setNewOffset("");
    setOpen(false);
    toast.success("Ciro offset'i güncellendi");
    // Custom event dispatch et
    window.dispatchEvent(new Event("revenueOffsetChanged"));
    window.location.reload(); // Sayfayı yenile
  };

  const handleReset = () => {
    if (
      !confirm(
        "Ciro offset'ini sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz."
      )
    ) {
      return;
    }

    localStorage.removeItem("revenue_offset");
    setOffset(0);
    setNewOffset("");
    setOpen(false);
    toast.success("Ciro offset'i sıfırlandı");
    // Custom event dispatch et
    window.dispatchEvent(new Event("revenueOffsetChanged"));
    window.location.reload(); // Sayfayı yenile
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ciro Ayarları</DialogTitle>
          <DialogDescription>
            Toplam ciroyu manuel olarak ayarlayabilirsiniz. Pozitif değer ekler,
            negatif değer çıkarır.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Mevcut Offset</Label>
            <div className="text-2xl font-bold mt-2">
              {offset >= 0 ? "+" : ""}
              {offset.toFixed(2)} TL
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Bu değer toplam cirodan eklenir/çıkarılır
            </p>
          </div>
          <div>
            <Label htmlFor="offset">Yeni Offset Değeri</Label>
            <Input
              id="offset"
              type="number"
              step="0.01"
              placeholder="Örn: -1000 veya 5000"
              value={newOffset}
              onChange={(e) => setNewOffset(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSetOffset} className="flex-1">
              Kaydet
            </Button>
            {offset !== 0 && (
              <Button
                variant="destructive"
                onClick={handleReset}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Sıfırla
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
