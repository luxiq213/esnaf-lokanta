import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        imageUrl: true,
        isDailyMenu: true,
      },
    });
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, stock, imageUrl } = await req.json();
    if (!name || !description || !price || !stock) {
      return NextResponse.json({ message: "Tüm alanlar zorunlu." }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: { name, description, price: Number(price), stock: Number(stock), imageUrl },
    });
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json({ message: "Ürün eklenemedi." }, { status: 500 });
  }
} 