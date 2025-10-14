import { Server as IOServer } from "socket.io";
import { NextResponse } from "next/server";

let io: IOServer;

export const GET = (req: Request) => {
  if (!io) {
    console.log("🟢 Iniciando servidor Socket.IO...");
    io = new IOServer({
      cors: { origin: "*" },
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("Usuario conectado");

      socket.on("joinRoom", (chatId: number) => {
        socket.join(`chat_${chatId}`);
      });

      socket.on("sendMessage", (msg) => {
        io.to(`chat_${msg.chatId}`).emit("newMessage", msg);
      });
    });
  }
  return NextResponse.json({ status: "ok" });
};
