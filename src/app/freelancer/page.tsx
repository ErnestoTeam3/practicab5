"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";

export default function FreelancerDashboard() {
  const router = useRouter();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [form, setForm] = useState({ name: "", skills: "", profilePic: "" });
  const [isActive, setIsActive] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("freelancer");
    if (!stored) return router.push("/freelancer/login");

    const data = JSON.parse(stored);
    console.log("📦 Datos del freelancer:", data);
    console.log("🔍 ID original:", data.id, "Tipo:", typeof data.id);

    const freelancerData = {
      ...data,
      id: Number(data.id),
    };

    setFreelancer(freelancerData);
    setForm({
      name: data.name,
      skills: data.skills,
      profilePic: data.profilePic || "",
    });
    setIsActive(data.isActive || false);

    fetchChats(freelancerData.id);
  }, [router]);

  // Socket.IO - Conectar y escuchar eventos
  useEffect(() => {
    if (!freelancer) return;

    const s = io("/", { path: "/api/socket" });
    setSocket(s);

    const freelancerId = Number(freelancer.id);
    console.log(`📊 Conectando al dashboard del freelancer: ${freelancerId}`);
    s.emit("joinFreelancerDashboard", freelancerId);

    // Evento cuando se crea un nuevo chat
    s.on("newChat", (newChat) => {
      console.log("✨ Nuevo chat creado:", newChat);
      setChats((prev) => [newChat, ...prev]); // Agregar al inicio
    });

    // Evento cuando llega un nuevo mensaje
    s.on("newMessage", (msg) => {
      console.log("📨 Nuevo mensaje recibido en dashboard:", msg);

      // Actualizar el último mensaje del chat
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === msg.chatId
            ? { ...chat, lastMessage: msg.content, updatedAt: new Date() }
            : chat
        )
      );
    });

    return () => {
      s.disconnect();
    };
  }, [freelancer]);

  const fetchChats = async (freelancerId: number) => {
    try {
      const res = await fetch(
        `/api/freelancer/chats?freelancerId=${freelancerId}`
      );
      const data = await res.json();
      console.log("💬 Chats cargados:", data);
      if (res.ok) setChats(data);
    } catch (err) {
      console.error("Error al cargar chats:", err);
    }
  };

  if (!freelancer) return <p className="text-center mt-10">Cargando...</p>;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/freelancer/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(freelancer.id), ...form }),
    });
    const data = await res.json();

    if (res.ok) {
      setFreelancer(data);
      localStorage.setItem("freelancer", JSON.stringify(data));
      alert("Perfil actualizado correctamente ✅");
      setShowForm(false);
    } else {
      alert(data.error || "Error al actualizar");
    }
  };

  const handleToggleActive = async () => {
    const res = await fetch("/api/freelancer/toggle", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(freelancer.id),
        isActive: !isActive,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      setIsActive(data.isActive);
      setFreelancer(data);
      localStorage.setItem("freelancer", JSON.stringify(data));
    } else {
      alert(data.error || "Error al cambiar estado");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("freelancer");
    router.push("/");
  };

  const handleChat = (chatId: number) => {
    router.push(`/freelancer/chat/${chatId}`);
  };

  const handleDeleteChat = async (chatId: number) => {
    if (!confirm("¿Seguro que deseas eliminar este chat?")) return;

    try {
      const res = await fetch(`/api/freelancer/chats/${chatId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
      } else {
        const data = await res.json();
        alert(data.error || "No se pudo eliminar el chat");
      }
    } catch (err) {
      console.error("Error al eliminar chat:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 relative pb-20">
      <header className="flex justify-between items-center p-6 bg-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {form.profilePic ? (
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              src={form.profilePic}
              alt="Foto de perfil"
              className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
              {freelancer.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-lg font-semibold text-gray-800">
            {freelancer.name}
          </h1>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            {showForm ? "Cerrar" : "Editar Perfil"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cerrar sesión
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-10"
          >
            <motion.form
              onSubmit={handleUpdate}
              className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-5 border border-indigo-100"
            >
              <h2 className="text-2xl font-bold text-center text-indigo-600">
                Editar Perfil
              </h2>

              <input
                type="text"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Habilidades (skills)"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="URL de foto de perfil"
                value={form.profilePic}
                onChange={(e) =>
                  setForm({ ...form, profilePic: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              />

              {form.profilePic && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={form.profilePic}
                  alt="preview"
                  className="w-24 h-24 rounded-full mx-auto border shadow-md"
                />
              )}

              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                >
                  Guardar cambios
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleToggleActive}
                  className={`w-full py-3 font-semibold rounded-lg shadow-md transition ${
                    isActive
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isActive
                    ? "Desactivar Disponibilidad"
                    : "Activar Disponibilidad"}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl mt-10 mx-auto border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          Chats Activos
        </h2>

        {chats.length === 0 ? (
          <p className="text-gray-500 text-center">
            No tienes chats activos
          </p>
        ) : (
          <ul className="space-y-4">
            {chats.map((chat) => (
              <motion.li
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div
                  onClick={() => handleChat(chat.id)}
                  className="cursor-pointer flex-1"
                >
                  <p className="font-semibold text-gray-800">
                    {chat.clientName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {chat.lastMessage || "Sin mensajes aún"}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteChat(chat.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
                >
                  Eliminar
                </motion.button>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.section>
    </main>
  );
}