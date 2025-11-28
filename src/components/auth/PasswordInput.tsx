// src/components/auth/PasswordInput.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showStrength?: boolean;
}

export function PasswordInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  showStrength = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Şifre güçlülük kontrolü
  const getPasswordStrength = (password: string): {
    strength: "weak" | "medium" | "strong";
    percentage: number;
    label: string;
    color: string;
  } => {
    if (!password) {
      return { strength: "weak", percentage: 0, label: "", color: "bg-gray-200" };
    }

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    if (strength <= 2) {
      return {
        strength: "weak",
        percentage: 33,
        label: "Zayıf",
        color: "bg-red-500",
      };
    } else if (strength <= 4) {
      return {
        strength: "medium",
        percentage: 66,
        label: "Orta",
        color: "bg-yellow-500",
      };
    } else {
      return {
        strength: "strong",
        percentage: 100,
        label: "Güçlü",
        color: "bg-green-500",
      };
    }
  };

  const strengthInfo = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pr-10", className)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      {showStrength && value && strengthInfo && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Şifre Gücü:</span>
            <span
              className={cn(
                "font-semibold",
                strengthInfo.strength === "weak" && "text-red-500",
                strengthInfo.strength === "medium" && "text-yellow-500",
                strengthInfo.strength === "strong" && "text-green-500"
              )}
            >
              {strengthInfo.label}
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-300", strengthInfo.color)}
              style={{ width: `${strengthInfo.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}





