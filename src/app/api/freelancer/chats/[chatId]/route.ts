import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  context: { params: { chatId: string } } // params ya viene "awaited"
) {
  try {
    const chatId = Number(context.params.chatId);
    if (!chatId) return NextResponse.json({ error: "Chat inválido" }, { status: 400 });

    // Eliminar mensajes
    await prisma.message.deleteMany({ where: { chatId } });

    // Eliminar chat
    await prisma.chat.delete({ where: { id: chatId } });

    return NextResponse.json({ message: "Chat eliminado correctamente ✅" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar chat" }, { status: 500 });
  }
}
