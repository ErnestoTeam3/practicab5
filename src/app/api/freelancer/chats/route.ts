// src/app/api/freelancer/chats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const freelancerId = Number(searchParams.get("freelancerId"));

    if (!freelancerId) {
      return NextResponse.json(
        { error: "Freelancer ID requerido" },
        { status: 400 }
      );
    }

    // 🧠 Buscar los chats del freelancer con su último mensaje y el cliente
    const chats = await prisma.chat.findMany({
      where: { freelancerId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // solo el último mensaje
        },
        client: {
          select: {
            companyName: true,
            profilePic: true,
            projectName: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // 📦 Formatear los datos para el frontend
    const formatted = chats.map((chat) => ({
      id: chat.id,
      clientName: chat.client?.companyName || "Cliente desconocido",
      projectName: chat.client?.projectName || "",
      profilePic: chat.client?.profilePic || "",
      lastMessage: chat.messages[0]?.content || "Sin mensajes aún",
      updatedAt: chat.updatedAt.toLocaleString(), // ✅ corregido
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("❌ Error al obtener chats del freelancer:", error);

    if (error.message.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "No se pudo conectar a la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
