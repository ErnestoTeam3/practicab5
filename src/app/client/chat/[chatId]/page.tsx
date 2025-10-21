"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";

export default function ClientChatRoom() {
  const params = useParams<{ chatId: string }>();
  const chatId = params?.chatId;

  const [client, setClient] = useState<any>(null);
  const [freelancer, setFreelancer] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  if (!chatId) return <p>Cargando chat...</p>;

  // Cargar cliente del localStorage
  useEffect(() => {
    const stored = localStorage.getItem("client");
    if (stored) setClient(JSON.parse(stored));
  }, []);

  // Cargar chat inicial
  useEffect(() => {
    if (!chatId) return;
    fetch(`/api/chat/${chatId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setFreelancer(data.freelancer);
      });
  }, [chatId]);

  // Socket.io
  useEffect(() => {
    if (!chatId) return;

    const s = io("/", { path: "/api/socket" });
    setSocket(s);

    s.emit("joinRoom", Number(chatId));
    s.on("newMessage", (msg) => {
      console.log("📨 Mensaje recibido desde servidor:", msg);
      setMessages((prev) => [...prev, msg]);
    });

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
    if (!newMessage.trim() || !client) return;

    const msg = {
      chatId: Number(chatId),
      senderId: client.id,
      senderType: "client",
      content: newMessage,
    };

    setNewMessage("");

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });

      if (!res.ok) throw new Error("Error al enviar");
      // El servidor emitirá el mensaje a través de Socket.IO
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  };

  if (!client || !freelancer) return <p>Cargando chat...</p>;

  return (
    <main className="flex h-screen bg-gray-100">
      {/* PANEL IZQUIERDO: info del freelancer */}
      <aside className="w-1/4 bg-white border-r border-gray-300 p-6 flex flex-col items-center space-y-4">
        {freelancer.profilePic && (
          <img
            src={freelancer.profilePic}
            alt={freelancer.name}
            className="w-24 h-24 rounded-full shadow"
          />
        )}
        <h2 className="text-xl font-bold text-gray-800">{freelancer.name}</h2>
        <p className="text-gray-600 text-center">{freelancer.skills}</p>
        <p className="text-gray-500 text-sm text-center mt-2">
          {freelancer.email}
        </p>
      </aside>

      {/* CHAT */}
      <div className="flex-1 flex flex-col">
        <header className="bg-indigo-600 text-white py-4 flex items-center justify-center space-x-3">
          <span> {freelancer.name}</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderType === "client" && msg.senderId === client.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-xs shadow ${
                  msg.senderType === "client" && msg.senderId === client.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="flex p-4 bg-white border-t border-gray-300"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-3 border rounded-lg mr-3"
            placeholder="Escribe un mensaje..."
          />
          <button
            type="submit"
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg"
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}