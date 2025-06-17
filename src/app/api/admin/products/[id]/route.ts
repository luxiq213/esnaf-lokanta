import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, description, price, stock, imageUrl } = await req.json();
    const data: any = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (price) data.price = Number(price);
    if (stock) data.stock = Number(stock);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    const product = await prisma.product.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json({ message: "Güncelleme hatası." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Ürün silindi." });
  } catch (e) {
    return NextResponse.json({ message: "Silme hatası." }, { status: 500 });
  }
} 