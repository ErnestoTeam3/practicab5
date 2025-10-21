import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { waitForSocketIO } from "@/lib/socket-init";

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

    // Validar que el mensaje no esté vacío
    if (!content.trim()) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 }
      );
    }

    // Crear mensaje en la BD
    const msg = await prisma.message.create({
      data: {
        chatId,
        senderId,
        senderType,
        content,
      },
    });

    // ✅ Esperar a que Socket.IO esté listo y emitir
    const socketReady = await waitForSocketIO();

    if (socketReady && (global as any).io) {
      try {
        // Obtener la información del chat (cliente y freelancer)
        const chat = await prisma.chat.findUnique({
          where: { id: chatId },
          include: {
            client: true,
            freelancer: true,
          },
        });

        if (chat) {
          const messageData = {
            id: msg.id,
            chatId: msg.chatId,
            senderId: msg.senderId,
            senderType: msg.senderType,
            content: msg.content,
            createdAt: msg.createdAt,
          };

          // 📨 Emitir a la sala del chat (para actualizar la conversación)
          console.log(`📤 Emitiendo mensaje a sala chat_${chatId}:`, msg.content);
          (global as any).io.to(`chat_${chatId}`).emit("newMessage", messageData);

          // 📊 Emitir al dashboard del freelancer (para actualizar el último mensaje)
          const freelancerId = chat.freelancer.id;
          console.log(
            `📤 Emitiendo al dashboard del freelancer: freelancer_dashboard_${freelancerId}`
          );
          (global as any).io
            .to(`freelancer_dashboard_${freelancerId}`)
            .emit("newMessage", {
              ...messageData,
              clientName: chat.client.companyName,
            });

          // 📊 Emitir al dashboard del cliente (si existe)
          const clientId = chat.client.id;
          console.log(
            `📤 Emitiendo al dashboard del cliente: client_dashboard_${clientId}`
          );
          (global as any).io
            .to(`client_dashboard_${clientId}`)
            .emit("newMessage", {
              ...messageData,
              freelancerName: chat.freelancer.name,
            });

          console.log(`✅ Mensaje emitido a todas las salas correctamente`);
        } else {
          console.warn("⚠️ Chat no encontrado, no se puede emitir a dashboards");
          // Pero igual emitir a la sala del chat
          (global as any).io.to(`chat_${chatId}`).emit("newMessage", msg);
        }
      } catch (socketErr) {
        console.error("❌ Error al emitir mensaje por Socket.IO:", socketErr);
        // El mensaje se guardó en BD, solo falla la emisión
      }
    } else {
      console.warn(
        "⚠️ Socket.IO no está disponible, mensaje guardado pero no emitido"
      );
    }

    return NextResponse.json(msg);
  } catch (err) {
    console.error("❌ Error al crear mensaje:", err);
    return NextResponse.json(
      { error: "Error interno al crear mensaje" },
      { status: 500 }
    );
  }
}

// ✅ Declarar tipo global de Socket.IO
declare global {
  var io: any;
}