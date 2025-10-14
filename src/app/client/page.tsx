"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientPage() {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [form, setForm] = useState({
    companyName: "",
    projectName: "",
    projectDesc: "",
    profilePic: "",
  });
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  // ⚡ Cargar datos del cliente desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("client");
    if (!stored) return router.push("/client/login");

    const data = JSON.parse(stored);
    setClient(data);
    setForm({
      companyName: data.companyName,
      projectName: data.projectName,
      projectDesc: data.projectDesc || "",
      profilePic: data.profilePic || "",
    });
  }, [router]);

  // ⚡ Cargar freelancers activos
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await fetch("/api/freelancer/active");
        const data = await res.json();
        if (res.ok) setFreelancers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFreelancers();
  }, []);

  if (!client) return <p className="text-center mt-10">Cargando...</p>;

  // 🔄 Actualizar información del cliente
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/client/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: client.id, ...form }),
    });
    const data = await res.json();
    if (res.ok) {
      setClient(data);
      localStorage.setItem("client", JSON.stringify(data));
      alert("Datos actualizados ✅");
      setShowForm(false);
    } else alert(data.error || "Error al actualizar");
  };

  // 🔓 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("client");
    router.push("/");
  };

  // 💬 Iniciar chat con un freelancer
  const handleChat = async (freelancerId: string) => {
    try {
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client.id,
          freelancerId: Number(freelancerId),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/client/chat/${data.chat.id}`);
      } else {
        alert(data.error || "Error al iniciar chat");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 relative pb-20">
      {/* Header con foto, editar y logout */}
      <header className="flex justify-between items-center p-6 bg-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {form.profilePic ? (
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              src={form.profilePic}
              alt="Foto de perfil"
              className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
              {client.companyName?.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-lg font-semibold text-gray-800">
            {client.companyName}
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

      {/* Animación de formulario */}
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
                Editar Información
              </h2>

              <input
                type="text"
                placeholder="Nombre de la empresa"
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={form.projectName}
                onChange={(e) =>
                  setForm({ ...form, projectName: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Descripción del proyecto"
                value={form.projectDesc}
                onChange={(e) =>
                  setForm({ ...form, projectDesc: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="URL Foto de perfil"
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

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                Guardar cambios
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Freelancers activos */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl mt-10 mx-auto border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          Freelancers Activos
        </h2>

        {freelancers.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay freelancers activos 😢
          </p>
        ) : (
          <ul className="space-y-4">
            {freelancers.map((f) => (
              <motion.li
                key={f.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={f.profilePic || "https://via.placeholder.com/40"}
                    alt={f.name}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{f.name}</p>
                    <p className="text-sm text-gray-500">{f.skills}</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChat(f.id)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  💬 Chatear
                </motion.button>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.section>
    </main>
  );
}
