// src/components/Header.tsx
"use client" 

import Link from "next/link"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User } from "lucide-react"

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
      
      {/* DEĞİŞİKLİK: 
        'container' ve 'mx-auto' sınıflarını kaldırdık.
        'w-full' (tam genişlik) ve 'px-4' (manuel kenar boşluğu) ekledik.
        Büyük ekranlar için 'lg:px-8' ile boşluğu biraz daha artırabiliriz.
      */}
      <div className="w-full flex justify-between items-center h-16 px-[1%]">
        
        {/* BÖLÜM 1: SOL (LOGO) */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Kalender Logo - Türkiyenin Toptan Adresi"
            width={150} // Logonuzun güncel genişliği
            height={50} // Logonuzun güncel yüksekliği
            priority
          />
        </Link>

        {/* BÖLÜM 2: ORTA (NAVİGASYON) */}
        {/* DEĞİŞİKLİK: 
           justify-between kullandığımız için menüyü ortada tutmak için
          'absolute' ve 'left-1/2' gibi sınıflar ekliyoruz.
        */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Ana Sayfa
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/hakkimizda" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Hakkımızda
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* BÖLÜM 3: SAĞ (İKONLAR VE ARAMA) */}
        <div className="flex items-center space-x-2">
          
          <div className="hidden lg:flex items-center space-x-1">
            <Input
              type="search"
              placeholder="Ürün ara..."
              className="w-full md:w-[200px] lg:w-[300px]"
            />
            <Button type="submit" variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <div className="lg:hidden">
            <Button type="submit" variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
        
      </div>
    </header>
  )
}