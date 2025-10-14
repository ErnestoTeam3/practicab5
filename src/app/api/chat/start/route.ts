// src/app/api/chat/start/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // ✅ usa la instancia global, no PrismaClient directo

export async function POST(req: Request) {
  try {
    const { clientId, freelancerId } = await req.json();

    if (!clientId || !freelancerId) {
      return NextResponse.json(
        { error: "Faltan clientId o freelancerId" },
        { status: 400 }
      );
    }

    // ✅ Buscar si ya existe un chat entre ambos
    let chat = await prisma.chat.findFirst({
      where: { clientId: Number(clientId), freelancerId: Number(freelancerId) },
      include: { messages: true },
    });

    // ✅ Si no existe, créalo
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          clientId: Number(clientId),
          freelancerId: Number(freelancerId),
        },
        include: { messages: true },
      });
    }

    return NextResponse.json({ chat });
  } catch (err) {
    console.error("Error en /api/chat/start:", err);
    return NextResponse.json(
      { error: "Error al iniciar chat" },
      { status: 500 }
    );
  }
}
