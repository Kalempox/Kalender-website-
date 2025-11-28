// src/lib/email.ts
// E-posta gönderme yardımcı fonksiyonları
// Not: Production'da Resend, SendGrid veya benzeri bir servis kullanılmalı

interface OrderData {
  id: string;
  orderNumber: string;
  totalPrice: number;
  createdAt: Date;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    district?: string | null;
    postalCode?: string | null;
    phone: string;
  };
  orderItems: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
}

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  // Production'da burada gerçek e-posta gönderme servisi kullanılır
  // Şimdilik console'a yazdırıyoruz (geliştirme için)
  console.log("=== E-POSTA DOĞRULAMA ===");
  console.log("Alıcı:", email);
  console.log("Doğrulama Linki:", verificationUrl);
  console.log("========================");

  // Production için örnek (Resend kullanımı):
  /*
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'noreply@kalender.com',
      to: email,
      subject: 'E-postanızı Doğrulayın',
      html: `
        <h1>E-postanızı Doğrulayın</h1>
        <p>Hesabınızı aktifleştirmek için aşağıdaki linke tıklayın:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    });
  }
  */
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  // Production'da burada gerçek e-posta gönderme servisi kullanılır
  console.log("=== ŞİFRE SIFIRLAMA ===");
  console.log("Alıcı:", email);
  console.log("Sıfırlama Linki:", resetUrl);
  console.log("======================");

  // Production için örnek:
  /*
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'noreply@kalender.com',
      to: email,
      subject: 'Şifrenizi Sıfırlayın',
      html: `
        <h1>Şifrenizi Sıfırlayın</h1>
        <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Bu link 1 saat geçerlidir.</p>
      `,
    });
  }
  */
}

// Sipariş Onay E-postası (Kullanıcıya)
export async function sendOrderConfirmationEmail(
  email: string,
  order: OrderData
): Promise<void> {
  const orderDate = new Date(order.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const orderItemsHtml = order.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} TL</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(2)} TL</td>
    </tr>
  `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .order-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #f3f4f6; padding: 10px; text-align: left; }
        td { padding: 8px; }
        .total { font-size: 18px; font-weight: bold; color: #2563eb; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Siparişiniz Alındı!</h1>
        </div>
        <div class="content">
          <p>Sayın ${order.shippingAddress.fullName},</p>
          <p>Siparişiniz başarıyla alınmıştır. En kısa sürede hazırlanıp size ulaştırılacaktır.</p>
          
          <div class="order-info">
            <h3>Sipariş Bilgileri</h3>
            <p><strong>Sipariş No:</strong> ${order.orderNumber}</p>
            <p><strong>Sipariş Tarihi:</strong> ${orderDate}</p>
          </div>

          <div class="order-info">
            <h3>Teslimat Adresi</h3>
            <p>${order.shippingAddress.fullName}</p>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.district || ""} ${order.shippingAddress.city}</p>
            ${order.shippingAddress.postalCode ? `<p>Posta Kodu: ${order.shippingAddress.postalCode}</p>` : ""}
            <p>Telefon: ${order.shippingAddress.phone}</p>
          </div>

          <h3>Sipariş Detayları</h3>
          <table>
            <thead>
              <tr>
                <th>Ürün</th>
                <th style="text-align: center;">Adet</th>
                <th style="text-align: right;">Birim Fiyat</th>
                <th style="text-align: right;">Toplam</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; font-weight: bold; padding-top: 10px;">Genel Toplam:</td>
                <td class="total" style="text-align: right; padding-top: 10px;">${order.totalPrice.toFixed(2)} TL</td>
              </tr>
            </tfoot>
          </table>

          <p>Siparişinizin durumunu "Hesabım > Sipariş Geçmişi" bölümünden takip edebilirsiniz.</p>
        </div>
        <div class="footer">
          <p>Teşekkür ederiz. İyi alışverişler!</p>
          <p>Kalender Toptan</p>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log("\n=== SİPARİŞ ONAY E-POSTASI (KULLANICI) ===");
  console.log("Alıcı:", email);
  console.log("Konu: Siparişiniz Alındı!");
  console.log("Sipariş No:", order.orderNumber);
  console.log("Toplam:", order.totalPrice.toFixed(2), "TL");
  console.log("E-posta HTML içeriği hazırlandı");
  console.log("===============================\n");

  // Production için örnek:
  // Şimdilik console'a log basıyoruz, production'da gerçek e-posta servisi kullanılacak
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unusedEmailHtml = emailHtml; // Production'da kullanılacak

  /*
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'siparis@kalender.com',
      to: email,
      subject: `Siparişiniz Alındı - ${order.orderNumber}`,
      html: emailHtml,
    });
  }
  */
}

// Yeni Sipariş Bildirimi (Admin'e)
export async function sendAdminOrderNotification(order: OrderData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@kalender.com";
  const orderDate = new Date(order.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const orderItemsHtml = order.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(2)} TL</td>
    </tr>
  `
    )
    .join("");

  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .alert { background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #f3f4f6; padding: 10px; text-align: left; }
        td { padding: 8px; }
        .total { font-size: 18px; font-weight: bold; color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ YENİ SİPARİŞ!</h1>
        </div>
        <div class="content">
          <div class="alert">
            <strong>Yeni bir sipariş geldi!</strong> Lütfen en kısa sürede işleme alın.
          </div>
          
          <h3>Sipariş Bilgileri</h3>
          <p><strong>Sipariş No:</strong> ${order.orderNumber}</p>
          <p><strong>Sipariş Tarihi:</strong> ${orderDate}</p>
          <p><strong>Toplam Tutar:</strong> <span class="total">${order.totalPrice.toFixed(2)} TL</span></p>

          <h3>Teslimat Adresi</h3>
          <p>${order.shippingAddress.fullName}</p>
          <p>${order.shippingAddress.address}</p>
          <p>${order.shippingAddress.district || ""} ${order.shippingAddress.city}</p>
          <p>Telefon: ${order.shippingAddress.phone}</p>

          <h3>Sipariş Detayları</h3>
          <table>
            <thead>
              <tr>
                <th>Ürün</th>
                <th style="text-align: center;">Adet</th>
                <th style="text-align: right;">Toplam</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>

          <p><a href="${process.env.NEXTAUTH_URL}/admin/orders" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">Siparişleri Görüntüle</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log("\n=== YENİ SİPARİŞ BİLDİRİMİ (ADMİN) ===");
  console.log("Alıcı:", adminEmail);
  console.log("Konu: Yeni Sipariş!");
  console.log("Sipariş No:", order.orderNumber);
  console.log("Toplam:", order.totalPrice.toFixed(2), "TL");
  console.log("E-posta HTML içeriği hazırlandı");
  console.log("===================================\n");

  // Production için örnek:
  // Şimdilik console'a log basıyoruz, production'da gerçek e-posta servisi kullanılacak
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unusedAdminEmailHtml = adminEmailHtml; // Production'da kullanılacak

  /*
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'siparis@kalender.com',
      to: adminEmail,
      subject: `⚠️ Yeni Sipariş - ${order.orderNumber}`,
      html: adminEmailHtml,
    });
  }
  */
}

