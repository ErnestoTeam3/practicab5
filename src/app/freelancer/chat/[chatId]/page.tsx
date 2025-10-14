"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";

export default function FreelancerChatRoom() {
  const params = useParams<{ chatId: string }>();
  const chatId = params?.chatId;

  const [freelancer, setFreelancer] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  if (!chatId) return <p>Cargando chat...</p>;

  // Cargar freelancer del localStorage
  useEffect(() => {
    const stored = localStorage.getItem("freelancer");
    if (stored) setFreelancer(JSON.parse(stored));
  }, []);

  // Cargar chat inicial
  useEffect(() => {
    if (!chatId) return;
    fetch(`/api/chat/${chatId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setClient(data.client);
      });
  }, [chatId]);

  // Socket.io
  useEffect(() => {
    if (!chatId) return;

    const s = io("/", { path: "/api/socket" });
    setSocket(s);

    s.emit("joinRoom", Number(chatId));
    s.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      s.disconnect();
    };
  }, [chatId]);

  // Scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enviar mensaje
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !freelancer) return;

    const msg = {
      chatId: Number(chatId),
      senderId: freelancer.id,
      senderType: "freelancer",
      content: newMessage,
    };

    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });

    const data = await res.json();
    socket?.emit("sendMessage", data);
    setNewMessage("");
  };

  if (!freelancer || !client) return <p>Cargando chat...</p>;

  return (
    <main className="flex h-screen bg-gradient-to-br from-pink-50 via-white to-gray-100">
      {/* PANEL IZQUIERDO: info del cliente */}
      <aside className="w-1/4 bg-white border-r border-gray-300 p-6 flex flex-col items-center space-y-4">
        {client.profilePic && (
          <img
            src={client.profilePic}
            alt={client.companyName}
            className="w-24 h-24 rounded-full shadow"
          />
        )}
        <h2 className="text-xl font-bold text-gray-800">{client.companyName}</h2>
        <p className="text-gray-600 text-center">{client.projectName}</p>
        <p className="text-gray-500 text-sm text-center mt-2">{client.email}</p>
        <p className="text-gray-500 text-sm text-center mt-1">{client.projectDesc}</p>
      </aside>

      {/* CHAT */}
      <div className="flex-1 flex flex-col">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-pink-600 text-white py-4 flex items-center justify-center space-x-3 shadow-md"
        >
          <h2 className="font-semibold text-lg">
           {client.companyName}
          </h2>
        </motion.header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => {
            const isFreelancer =
              msg.senderType === "freelancer" && msg.senderId === freelancer.id;

            return (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${isFreelancer ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-xs shadow-md text-sm ${
                    isFreelancer
                      ? "bg-pink-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSend}
          className="flex p-4 bg-white border-t border-gray-200 shadow-inner"
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            placeholder="Escribe un mensaje..."
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="ml-3 px-5 py-3 bg-pink-600 text-white font-semibold rounded-xl shadow-md hover:bg-pink-700 transition"
          >
            🚀 Enviar
          </motion.button>
        </motion.form>
      </div>
    </main>
  );
}
