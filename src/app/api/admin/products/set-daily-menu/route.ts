import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "ID zorunlu." }, { status: 400 });
    // Önce tüm ürünlerde isDailyMenu=false yap
    await prisma.product.updateMany({ data: { isDailyMenu: false } });
    // Sonra seçilen üründe true yap
    await prisma.product.update({ where: { id: Number(id) }, data: { isDailyMenu: true } });
    return NextResponse.json({ message: "Günün menüsü güncellendi." });
  } catch (e) {
    return NextResponse.json({ message: "İşlem hatası." }, { status: 500 });
  }
} 