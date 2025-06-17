// Sipariş oluşturma API endpoint'i: Sepet ve müşteri bilgisi alır, siparişi işler, stok günceller ve admin'e mail gönderir.
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Nodemailer ile mail gönderimi için transporter oluşturulur
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465, // 465 için true, 587 için false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Sipariş oluşturma işlemi
export async function POST(req: NextRequest) {
  try {
    // İstekten sepet ve müşteri bilgilerini al
    const { cart, customer } = await req.json(); // [{id, quantity, name, price}], müşteri bilgisi
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ message: "Sepet boş." }, { status: 400 });
    }
    // Sipariş detaylarını mail body olarak hazırla
    const orderDetails = cart.map(item =>
      `${item.name} x${item.quantity || 1} - ${item.price}₺`
    ).join("\n");
    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const customerInfo = customer
      ? `Müşteri Bilgileri:\nAd Soyad: ${customer.name}\nE-posta: ${customer.email}\nAdres: ${customer.address}\nTelefon: ${customer.phone}\n\n`
      : "";
    // Admin'e sipariş maili gönder
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Yeni Sipariş Bildirimi',
      text: `Yeni bir sipariş alındı!\n\n${customerInfo}${orderDetails}\n\nToplam: ${total.toFixed(2)}₺`,
    });
    // Stok güncelle/sil
    for (const item of cart) {
      const product = await prisma.product.findUnique({ where: { id: item.id } });
      if (!product) continue;
      const newStock = product.stock - (item.quantity || 1);
      if (newStock <= 0) {
        await prisma.product.delete({ where: { id: item.id } });
      } else {
        await prisma.product.update({ where: { id: item.id }, data: { stock: newStock } });
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    // Hata durumunda logla ve hata mesajı döndür
    console.error("Sipariş oluşturma hatası:", e);
    return NextResponse.json({ message: "Sipariş oluşturulamadı." }, { status: 500 });
  }
} 