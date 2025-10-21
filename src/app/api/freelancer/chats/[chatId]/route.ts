import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
): Promise<NextResponse> {
  try {
    // ✅ Esperar a que params se resuelva (en Next.js 15 los params vienen "awaited")
    const { chatId } = await params;

    const chatIdNumber = Number(chatId);
    if (!chatIdNumber) {
      return NextResponse.json({ error: "Chat inválido" }, { status: 400 });
    }

    // Eliminar mensajes
    await prisma.message.deleteMany({ where: { chatId: chatIdNumber } });

    // Eliminar el chat
    await prisma.chat.delete({ where: { id: chatIdNumber } });

    return NextResponse.json({ message: "Chat eliminado correctamente ✅" });
  } catch (error) {
    console.error("Error al eliminar chat:", error);
    return NextResponse.json({ error: "Error al eliminar chat" }, { status: 500 });
  }
}
