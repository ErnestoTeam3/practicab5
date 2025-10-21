import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ Firma correcta según el App Router de Next.js 15
export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string } }
): Promise<NextResponse> {
  try {
    const chatId = Number(params.chatId);

    if (!chatId) {
      return NextResponse.json({ error: "Chat inválido" }, { status: 400 });
    }

    // Eliminar mensajes asociados al chat
    await prisma.message.deleteMany({ where: { chatId } });

    // Eliminar el chat
    await prisma.chat.delete({ where: { id: chatId } });

    return NextResponse.json({ message: "Chat eliminado correctamente ✅" });
  } catch (error) {
    console.error("Error al eliminar chat:", error);
    return NextResponse.json({ error: "Error al eliminar chat" }, { status: 500 });
  }
}
