// src/app/(admin)/admin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Edit,
  Shield,
  User,
  Trash2,
  Building2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  companyName: string | null;
  taxId: string | null;
  taxOffice: string | null;
  companyAddress: string | null;
  _count: {
    orders: number;
  };
}

function DeleteUserButton({ userId }: { userId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Kullanıcı silinemedi");
        return;
      }

      toast.success("Kullanıcı başarıyla silindi");
      // Sayfayı yenile
      window.location.reload();
    } catch (error) {
      console.error("[DELETE_USER_ERROR]", error);
      toast.error("Bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" disabled={isDeleting}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem geri alınamaz. Kullanıcının tüm verileri (siparişler,
            adresler, vb.) kalıcı olarak silinecektir. Emin misiniz?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Siliniyor..." : "Evet, Sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function UserRow({ user }: { user: User }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDealer = !!(
    user.companyName ||
    user.taxId ||
    user.taxOffice ||
    user.companyAddress
  );

  return (
    <>
      <TableRow key={user.id}>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <span className="font-medium">{user.name || "İsimsiz"}</span>
          </div>
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {user.role === "ADMIN" ? (
              <Shield className="h-4 w-4 text-purple-600" />
            ) : isDealer ? (
              <Building2 className="h-4 w-4 text-blue-600" />
            ) : (
              <User className="h-4 w-4 text-gray-600" />
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === "ADMIN"
                  ? "bg-purple-100 text-purple-800"
                  : isDealer
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {user.role === "ADMIN"
                ? "Admin"
                : isDealer
                ? "Bayi"
                : "Kullanıcı"}
            </span>
          </div>
        </TableCell>
        <TableCell>{user._count.orders}</TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {new Date(user.createdAt).toLocaleDateString("tr-TR")}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/admin/users/${user.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteUserButton userId={user.id} />
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && isDealer && (
        <TableRow>
          <TableCell colSpan={6} className="bg-gray-50">
            <div className="p-4 space-y-2">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Bayi Bilgileri
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">
                    Ticari Ünvan:
                  </span>
                  <p className="text-gray-900">{user.companyName || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">VKN:</span>
                  <p className="text-gray-900">{user.taxId || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Vergi Dairesi:
                  </span>
                  <p className="text-gray-900">{user.taxOffice || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Firma Adresi:
                  </span>
                  <p className="text-gray-900">{user.companyAddress || "-"}</p>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("[FETCH_USERS_ERROR]", error);
      toast.error("Kullanıcılar yüklenemedi");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">
          Kayıtlı kullanıcıları görüntüleyin ve yönetin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İsim</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Sipariş Sayısı</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Henüz kullanıcı bulunmuyor
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
