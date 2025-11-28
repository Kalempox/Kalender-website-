// src/app/(admin)/admin/categories/page.tsx
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  FolderOpen,
  FolderTree,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getCategories() {
  return await db.category.findMany({
    include: {
      parent: true,
      subCategories: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  const mainCategories = categories.filter((cat) => !cat.parentId);
  const subCategories = categories.filter((cat) => cat.parentId);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FolderTree className="h-8 w-8 text-primary" />
            Kategori Yönetimi
          </h1>
          <p className="text-muted-foreground mt-1">
            Tüm kategorileri görüntüleyin, düzenleyin veya silin
          </p>
        </div>
        <Button asChild size="lg" className="shadow-md">
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kategori Ekle
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ana Kategoriler
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mainCategories.length}</div>
            <p className="text-xs text-muted-foreground">
              Toplam ana kategori sayısı
            </p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alt Kategoriler
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subCategories.length}</div>
            <p className="text-xs text-muted-foreground">
              Toplam alt kategori sayısı
            </p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Kategori
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Tüm kategoriler</p>
          </CardContent>
        </Card>
      </div>

      {/* Ana Kategoriler */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Ana Kategoriler
              </CardTitle>
              <CardDescription className="mt-1">
                {mainCategories.length} ana kategori bulunuyor
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {mainCategories.length} Adet
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {mainCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[120px]">Görsel</TableHead>
                    <TableHead className="font-semibold">
                      Kategori Adı
                    </TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-center">
                      Alt Kategoriler
                    </TableHead>
                    <TableHead className="text-center">Ürün Sayısı</TableHead>
                    <TableHead className="text-right font-semibold">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mainCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        {category.imageUrl ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 shadow-sm">
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center shadow-sm">
                            <span className="text-2xl font-bold text-primary">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-base">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        {category.subCategories?.length > 0 ? (
                          <Badge variant="outline" className="font-medium">
                            {category.subCategories.length} Alt Kategori
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-medium">
                          {category._count.products} Ürün
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Link
                              href={`/admin/categories/${category.id}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <Link
                              href={`/admin/categories/${category.id}/delete`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-medium">
                Henüz ana kategori eklenmemiş
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Yeni kategori eklemek için yukarıdaki butona tıklayın
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alt Kategoriler */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                Alt Kategoriler
              </CardTitle>
              <CardDescription className="mt-1">
                {subCategories.length} alt kategori bulunuyor
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {subCategories.length} Adet
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {subCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">
                      Kategori Adı
                    </TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Ana Kategori</TableHead>
                    <TableHead className="text-center">Ürün Sayısı</TableHead>
                    <TableHead className="text-right font-semibold">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-semibold text-base">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">→</span>
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {category.parent?.name || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-medium">
                          {category._count.products} Ürün
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Link
                              href={`/admin/categories/${category.id}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <Link
                              href={`/admin/categories/${category.id}/delete`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-medium">
                Henüz alt kategori eklenmemiş
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Alt kategori eklemek için bir ana kategori seçin
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
