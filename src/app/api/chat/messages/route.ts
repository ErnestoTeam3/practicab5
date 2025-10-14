// src/app/api/chat/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { chatId, senderId, senderType, content } = await req.json();

    // Validar datos requeridos
    if (!chatId || !senderId || !senderType || !content) {
      return NextResponse.json(
        { error: "Faltan datos (chatId, senderId, senderType, content)" },
        { status: 400 }
      );
    }

    // Crear mensaje
    const msg = await prisma.message.create({
      data: {
        chatId,
        senderId,
        senderType, // 👈 ahora sí guardamos si es client o freelancer
        content,
      },
    });

    return NextResponse.json(msg);
  } catch (err) {
    console.error("Error al crear mensaje:", err);
    return NextResponse.json(
      { error: "Error interno al crear mensaje" },
      { status: 500 }
    );
  }
}
