
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Kalender | Türkiyenin Toptan Adresi ',
  description: 'Biz kimiz? Ekibimizi, misyonumuzu ve vizyonumuzu bu sayfada keşfedin.',
}


export default function HakkimizdaPage() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">
        Hakkımızda Sayfası
      </h1>
      <p className="mt-4 text-lg">
        Burada şirketimiz veya projemiz hakkında bilgiler yer alacak.
      </p>
    </main>
  );
}