








// Kullanıcı giriş API endpoint'i: E-posta ve şifre ile giriş yapar, kullanıcıyı doğrular ve bilgilerini döndürür.
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// POST: Kullanıcı giriş işlemi
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "E-posta ve şifre zorunludur." }, { status: 400 });
    }
    // Kullanıcıyı veritabanında bul
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "E-posta veya şifre hatalı." }, { status: 401 });
    }
    // Şifreyi kontrol et
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: "E-posta veya şifre hatalı." }, { status: 401 });
    }
    // Admin onayı kontrolü
    if (!user.isApproved) {
      return NextResponse.json({ message: "Hesabınız henüz admin tarafından onaylanmadı." }, { status: 403 });
    }
    // Giriş başarılı, kullanıcı bilgilerini döndür ve cookie ayarla
    const response = NextResponse.json({
      message: "Giriş başarılı.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved,
      }
    });
    response.cookies.set("userId", String(user.id), { httpOnly: true, path: "/" });
    response.cookies.set("role", user.role, { httpOnly: true, path: "/" });
    return response;
  } catch (e) {
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
} 