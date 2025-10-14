// src/app/api/chat/[chatId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  // Await params antes de acceder a sus propiedades
  const { chatId } = await params;
  const chatIdNum = Number(chatId);

  if (!chatIdNum) {
    return NextResponse.json({ error: "Chat inválido" }, { status: 400 });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatIdNum },
      include: {
        freelancer: true,
        client: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat no encontrado" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (err) {
    console.error("Error al obtener chat:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}