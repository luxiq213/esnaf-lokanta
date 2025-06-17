import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ message: "Dosya bulunamadı." }, { status: 400 });
  }
  if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
    return NextResponse.json({ message: "Sadece jpg, png veya webp dosyası yükleyebilirsiniz." }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ message: "Dosya boyutu en fazla 2MB olmalı." }, { status: 400 });
  }
  const ext = file.name.split('.').pop();
  const fileName = `product_${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);
  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(uploadPath, Buffer.from(arrayBuffer));
  return NextResponse.json({ url: `/uploads/${fileName}` });
} 