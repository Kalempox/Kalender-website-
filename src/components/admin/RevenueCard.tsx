"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { RevenueSettings } from "./RevenueSettings";

interface RevenueCardProps {
  baseRevenue: number;
}

export function RevenueCard({ baseRevenue }: RevenueCardProps) {
  const [offset, setOffset] = useState<number>(0);
  const [displayRevenue, setDisplayRevenue] = useState<number>(baseRevenue);

  useEffect(() => {
    // localStorage'dan offset değerini yükle
    const savedOffset = localStorage.getItem("revenue_offset");
    if (savedOffset) {
      const offsetValue = parseFloat(savedOffset);
      setOffset(offsetValue);
      setDisplayRevenue(baseRevenue + offsetValue);
    } else {
      setDisplayRevenue(baseRevenue);
    }
  }, [baseRevenue]);

  // localStorage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = () => {
      const savedOffset = localStorage.getItem("revenue_offset");
      if (savedOffset) {
        const offsetValue = parseFloat(savedOffset);
        setOffset(offsetValue);
        setDisplayRevenue(baseRevenue + offsetValue);
      } else {
        setOffset(0);
        setDisplayRevenue(baseRevenue);
      }
    };

    // Storage event listener ekle
    window.addEventListener("storage", handleStorageChange);
    // Aynı sekmede değişiklikleri yakalamak için custom event dinle
    window.addEventListener("revenueOffsetChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("revenueOffsetChanged", handleStorageChange);
    };
  }, [baseRevenue]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Toplam Ciro</CardTitle>
        <DollarSign className="h-4 w-4 text-orange-600" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">
              {displayRevenue.toFixed(2)} TL
            </div>
            {offset !== 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Gerçek: {baseRevenue.toFixed(2)} TL{" "}
                {offset >= 0 ? "(+" : "("}
                {offset.toFixed(2)} TL)
              </div>
            )}
          </div>
          <RevenueSettings />
        </div>
      </CardContent>
    </Card>
  );
}
