"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  onClose: () => void;
}

export default function ClientAuthModal({ onClose }: Props) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [form, setForm] = useState({
    companyName: "",
    projectName: "",
    projectDesc: "",
    profilePic: "",
    email: "",
    password: "",
  });

  // 🔑 Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("client", JSON.stringify(data));
        onClose();
        router.push("/client");
      } else {
        alert(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error(err);
      alert("Error en la conexión");
    }
  };

  // 🔑 Registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/client/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("client", JSON.stringify(data));
        onClose();
        router.push("/client");
      } else {
        alert(data.error || "Error en el registro");
      }
    } catch (err) {
      console.error(err);
      alert("Error en la conexión");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-lg w-80 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center text-indigo-600 mb-4">
          {isLogin ? "Iniciar Sesión" : "Registro Cliente"}
        </h2>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="space-y-3"
        >
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre de la empresa"
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={form.projectName}
                onChange={(e) =>
                  setForm({ ...form, projectName: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Descripción del proyecto"
                value={form.projectDesc}
                onChange={(e) =>
                  setForm({ ...form, projectDesc: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="URL Foto de perfil"
                value={form.profilePic}
                onChange={(e) =>
                  setForm({ ...form, profilePic: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {isLogin ? "Entrar" : "Registrarse"}
          </button>
        </form>

        <p className="text-center text-sm mt-2">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
