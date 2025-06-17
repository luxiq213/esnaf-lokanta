import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, surname, email, password, address, phone } = await req.json();
    if (!name || !surname || !email || !password || !address || !phone) {
      return NextResponse.json({ message: "Tüm alanlar zorunludur." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Şifre en az 6 karakter olmalı." }, { status: 400 });
    }
    // E-posta benzersiz mi?
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Bu e-posta ile zaten kayıt olunmuş." }, { status: 400 });
    }
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    // Kullanıcıyı kaydet
    await prisma.user.create({
      data: {
        name: name + " " + surname,
        email,
        password: hashedPassword,
        address,
        phone,
        role: "customer",
        isApproved: false,
      },
    });
    return NextResponse.json({ message: "Başvurunuz alınmıştır, admin onayı bekleniyor." }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
} 