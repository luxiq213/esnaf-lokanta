import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
        address: true,
        phone: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ users });
  } catch (e) {
    return NextResponse.json({ users: [] }, { status: 500 });
  }
} 