// src/lib/turkey-cities.ts
// Satış yapılan şehirler ve ilçeleri

export interface City {
  name: string;
  districts: string[];
}

export const allowedCities: City[] = [
  {
    name: "Gaziantep",
    districts: [
      "Şahinbey",
      "Şehitkamil",
      "İslahiye",
      "Nizip",
      "Oğuzeli",
      "Araban",
      "Karkamış",
      "Nurdağı",
      "Yavuzeli",
    ],
  },
  {
    name: "Malatya",
    districts: [
      "Battalgazi",
      "Yeşilyurt",
      "Darende",
      "Akçadağ",
      "Arguvan",
      "Arapgir",
      "Doğanşehir",
      "Hekimhan",
      "Kuluncak",
      "Pütürge",
      "Yazıhan",
      "Doğanyol",
      "Kale",
    ],
  },
  {
    name: "Kahramanmaraş",
    districts: [
      "Dulkadiroğlu",
      "Onikişubat",
      "Afşin",
      "Andırın",
      "Çağlayancerit",
      "Ekinözü",
      "Elbistan",
      "Göksun",
      "Nurhak",
      "Pazarcık",
      "Türkoğlu",
    ],
  },
  {
    name: "Adıyaman",
    districts: [
      "Merkez",
      "Besni",
      "Çelikhan",
      "Gerger",
      "Gölbaşı",
      "Kahta",
      "Samsat",
      "Sincik",
      "Tut",
    ],
  },
  {
    name: "Şanlıurfa",
    districts: [
      "Eyyübiye",
      "Haliliye",
      "Karaköprü",
      "Akçakale",
      "Birecik",
      "Bozova",
      "Ceylanpınar",
      "Halfeti",
      "Harran",
      "Hilvan",
      "Siverek",
      "Suruç",
      "Viranşehir",
    ],
  },
  {
    name: "Elazığ",
    districts: [
      "Merkez",
      "Ağın",
      "Alacakaya",
      "Arıcak",
      "Baskil",
      "Karakoçan",
      "Keban",
      "Kovancılar",
      "Maden",
      "Palu",
      "Sivrice",
    ],
  },
];

// Şehir isimlerini döndür
export function getCityNames(): string[] {
  return allowedCities.map((city) => city.name);
}

// Şehir adına göre ilçeleri döndür
export function getDistrictsByCity(cityName: string): string[] {
  const city = allowedCities.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );
  return city ? city.districts : [];
}

// Şehir ara (autocomplete için)
export function searchCities(query: string): string[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getCityNames();

  return allowedCities
    .map((city) => city.name)
    .filter((name) => name.toLowerCase().startsWith(lowerQuery));
}

// Şehir geçerli mi kontrol et
export function isValidCity(cityName: string): boolean {
  return allowedCities.some(
    (city) => city.name.toLowerCase() === cityName.toLowerCase()
  );
}

// İlçe ara (autocomplete için)
export function searchDistricts(cityName: string, query: string): string[] {
  const districts = getDistrictsByCity(cityName);
  if (!districts.length) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return districts;

  return districts.filter((district) =>
    district.toLowerCase().startsWith(lowerQuery)
  );
}

