// Ürünleri listeleyen API endpoint'i: Tüm ürünleri döndürür.
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Tüm ürünleri döndürür
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json({ message: "Ürünler alınamadı." }, { status: 500 });
  }
} 