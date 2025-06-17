import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isApproved, role, name, email, address, phone, password } = await req.json();
    // Kendi rolünü değiştirme koruması
    const userId = req.cookies.get("userId")?.value;
    if (role && String(params.id) === userId) {
      return NextResponse.json({ message: "Kendi rolünüzü değiştiremezsiniz." }, { status: 403 });
    }
    const data: any = {};
    if (typeof isApproved === "boolean") data.isApproved = isApproved;
    if (role) data.role = role;
    if (name) data.name = name;
    if (email) data.email = email;
    if (address) data.address = address;
    if (phone) data.phone = phone;
    if (password) data.password = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: { id: Number(params.id) },
      data,
      select: { id: true, name: true, email: true, address: true, phone: true, role: true, isApproved: true },
    });
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ message: "Güncelleme hatası." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Kullanıcı silindi." });
  } catch (e) {
    return NextResponse.json({ message: "Silme hatası." }, { status: 500 });
  }
} 