import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));
  if (!userId) return NextResponse.json({ messages: [] }, { status: 400 });
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } }
    }
  });
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const { senderId, receiverId, content } = await req.json();
  if (!senderId || !receiverId || !content) {
    return NextResponse.json({ message: "Eksik alan." }, { status: 400 });
  }
  const message = await prisma.message.create({
    data: { senderId, receiverId, content }
  });
  return NextResponse.json({ message });
} 