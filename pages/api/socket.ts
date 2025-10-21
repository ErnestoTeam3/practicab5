import { Server as IOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server?: SocketServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as SocketWithIO;

  if (socket?.server?.io) {
    console.log("Socket.IO ya está inicializado");
    res.end();
    return;
  }

  console.log("🟢 Inicializando Socket.IO por primera vez...");

  const io = new IOServer(socket.server as HTTPServer, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    addTrailingSlash: false,
  });

  io.on("connection", (socket) => {
    console.log("✅ Cliente conectado:", socket.id);

    // 💬 Unirse a una sala de chat específica
    socket.on("joinRoom", (chatId: number) => {
      socket.join(`chat_${chatId}`);
      console.log(`📍 Socket ${socket.id} se unió a sala: chat_${chatId}`);
    });

    // 📊 Unirse a la sala del dashboard del freelancer
    socket.on("joinFreelancerDashboard", (freelancerId: string) => {
      socket.join(`freelancer_dashboard_${freelancerId}`);
      console.log(
        `📊 Socket ${socket.id} se unió al dashboard del freelancer: ${freelancerId}`
      );
    });

    socket.on("disconnect", () => {
      console.log("❌ Cliente desconectado:", socket.id);
    });
  });

  if (socket.server) {
    socket.server.io = io;
  }

  (global as any).io = io;
  res.end();
}