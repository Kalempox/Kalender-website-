// src/components/providers/AuthProvider.tsx
"use client" // Bu satır, bu bileşenin bir İstemci Bileşeni olduğunu belirtir

import { SessionProvider } from "next-auth/react"

// children: Bu bileşenin sarmaladığı diğer tüm bileşenlerdir (tüm sitemiz)
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // SessionProvider, NextAuth'ın oturum bilgisini
  // altındaki tüm bileşenlere (children) dağıtmasını sağlar.
  return <SessionProvider>{children}</SessionProvider>
}