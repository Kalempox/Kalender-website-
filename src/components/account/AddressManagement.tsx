// src/components/account/AddressManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import {
  searchCities,
  searchDistricts,
  getDistrictsByCity,
  isValidCity,
  getCityNames,
} from "@/lib/turkey-cities";

interface Address {
  id: string;
  type: string;
  title: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district?: string | null;
  postalCode?: string | null;
  isDefault: boolean;
}

export function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [districtSuggestions, setDistrictSuggestions] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [cityError, setCityError] = useState<string>("");
  const [formData, setFormData] = useState({
    type: "delivery",
    title: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    isDefault: false,
  });

  // Adresleri yükle
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error("Adres yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCityError("");

    // Şehir doğrulaması
    if (!isValidCity(formData.city)) {
      setCityError(
        `Teslimat sadece şu şehirlere yapılmaktadır: ${getCityNames().join(
          ", "
        )}`
      );
      return;
    }

    try {
      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAddresses();
        resetForm();
      } else {
        try {
          const errorData = await response.json();
          const errorMessage = errorData.error || "Bir hata oluştu";
          setCityError(errorMessage);
        } catch {
          const errorText = await response.text();
          setCityError(errorText || "Bir hata oluştu");
        }
      }
    } catch (error) {
      console.error("Adres kaydetme hatası:", error);
      alert("Bir hata oluştu");
    }
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      type: address.type,
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district || "",
      postalCode: address.postalCode || "",
      isDefault: address.isDefault,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAddresses();
      } else {
        alert("Silme işlemi başarısız");
      }
    } catch (error) {
      console.error("Adres silme hatası:", error);
      alert("Bir hata oluştu");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setCitySuggestions([]);
    setDistrictSuggestions([]);
    setShowCityDropdown(false);
    setShowDistrictDropdown(false);
    setFormData({
      type: "delivery",
      title: "",
      fullName: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      postalCode: "",
      isDefault: false,
    });
  };

  // Şehir input değiştiğinde
  const handleCityChange = (value: string) => {
    setCityError(""); // Hata mesajını temizle
    setFormData({ ...formData, city: value, district: "" }); // Şehir değişince ilçeyi temizle
    if (value.length > 0) {
      const suggestions = searchCities(value);
      setCitySuggestions(suggestions);
      setShowCityDropdown(true);

      // Eğer şehir tam yazıldıysa ve geçersizse hata göster
      if (
        value.length > 2 &&
        !isValidCity(value) &&
        !suggestions.includes(value)
      ) {
        setCityError(
          `Bu şehre teslimat yapılmamaktadır. Sadece şu şehirlere teslimat yapılmaktadır: ${getCityNames().join(
            ", "
          )}`
        );
      }
    } else {
      setCitySuggestions([]);
      setShowCityDropdown(false);
    }
  };

  // Şehir seçildiğinde
  const handleCitySelect = (city: string) => {
    setFormData({ ...formData, city, district: "" });
    setCitySuggestions([]);
    setShowCityDropdown(false);
    setDistrictSuggestions(getDistrictsByCity(city));
  };

  // İlçe input değiştiğinde
  const handleDistrictChange = (value: string) => {
    setFormData({ ...formData, district: value });
    if (value.length > 0 && formData.city) {
      const suggestions = searchDistricts(formData.city, value);
      setDistrictSuggestions(suggestions);
      setShowDistrictDropdown(true);
    } else {
      setDistrictSuggestions([]);
      setShowDistrictDropdown(false);
    }
  };

  // İlçe seçildiğinde
  const handleDistrictSelect = (district: string) => {
    setFormData({ ...formData, district });
    setDistrictSuggestions([]);
    setShowDistrictDropdown(false);
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Adres Listesi */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {address.title}
                    {address.isDefault && (
                      <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Varsayılan
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="capitalize">
                    {address.type === "delivery" ? "Teslimat" : "Fatura"} Adresi
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>{address.fullName}</strong>
                </p>
                <p>{address.phone}</p>
                <p>{address.address}</p>
                <p>
                  {address.district && `${address.district}, `}
                  {address.city}
                  {address.postalCode && ` ${address.postalCode}`}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {addresses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Henüz adres eklenmemiş
          </div>
        )}
      </div>

      {/* Adres Ekleme/Düzenleme Formu */}
      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Adres Düzenle" : "Yeni Adres Ekle"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Adres Tipi</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="delivery">Teslimat</option>
                    <option value="billing">Fatura</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Başlık (Ev, İş, vb.)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ev"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <Label htmlFor="city">Şehir *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    onFocus={() => {
                      if (formData.city) {
                        const suggestions = searchCities(formData.city);
                        setCitySuggestions(suggestions);
                        setShowCityDropdown(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowCityDropdown(false);
                        // Blur sonrası şehir doğrulaması
                        if (formData.city && !isValidCity(formData.city)) {
                          setCityError(
                            `Teslimat sadece şu şehirlere yapılmaktadır: ${getCityNames().join(
                              ", "
                            )}`
                          );
                        }
                      }, 200);
                    }}
                    required
                    placeholder="Örn: Gaziantep"
                    className={cityError ? "border-red-500" : ""}
                    aria-invalid={!!cityError}
                    aria-describedby={cityError ? "city-error" : undefined}
                  />
                  {cityError && (
                    <p
                      id="city-error"
                      className="text-sm text-red-600 mt-1"
                      role="alert"
                    >
                      {cityError}
                    </p>
                  )}
                  {!cityError && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Teslimat: {getCityNames().join(", ")}
                    </p>
                  )}
                  {showCityDropdown && citySuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {citySuggestions.map((city) => (
                        <button
                          key={city}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Label htmlFor="district">İlçe</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    onFocus={() => {
                      if (formData.city) {
                        setDistrictSuggestions(
                          getDistrictsByCity(formData.city)
                        );
                        setShowDistrictDropdown(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowDistrictDropdown(false), 200);
                    }}
                    disabled={!formData.city}
                    placeholder={
                      formData.city ? "Örn: Şahinbey" : "Önce şehir seçin"
                    }
                  />
                  {showDistrictDropdown && districtSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {districtSuggestions.map((district) => (
                        <button
                          key={district}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleDistrictSelect(district)}
                        >
                          {district}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="postalCode">Posta Kodu</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                  Varsayılan adres olarak ayarla
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  {editingId ? "Güncelle" : "Ekle"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Adres Ekle
        </Button>
      )}
    </div>
  );
}
