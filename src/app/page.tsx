"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Users, Rocket } from "lucide-react";
import ClientAuthModal from "../components/ClientAuthModal";
import FreelancerAuthModal from "../components/FreelancerAuthModal";

export default function Home() {
  const [showRoles, setShowRoles] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-400 text-gray-800">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl font-extrabold text-white drop-shadow-lg mb-6"
        >
          Bienvenido a{" "}
          <span className="text-blue-100">FreeConnect 🚀</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg text-white/90 max-w-2xl mb-10"
        >
          Conecta clientes con freelancers de todo el mundo.  
          Encuentra talento o comparte tus habilidades en un solo lugar.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <button
            onClick={() => setShowRoles(true)}
            className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-blue-50 transition"
          >
            Comenzar Ahora
          </button>
        </motion.div>
      </section>

      {/* SECCIÓN INTERMEDIA */}
      <AnimatePresence>
        {!showRoles && (
          <motion.section
            key="info"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="bg-white py-16 px-8 text-center shadow-inner"
          >
            <h2 className="text-3xl font-bold text-blue-700 mb-12">
              ¿Por qué elegir FreeConnect?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {/* Card 1 */}
              <motion.div
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-6 bg-blue-50 rounded-2xl shadow-md hover:shadow-xl"
              >
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-blue-700">
                  Conexión Global
                </h3>
                <p className="text-gray-600">
                  Colabora con profesionales y empresas de todo el mundo sin límites.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-6 bg-cyan-50 rounded-2xl shadow-md hover:shadow-xl"
              >
                <Briefcase className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-cyan-700">
                  Oportunidades Reales
                </h3>
                <p className="text-gray-600">
                  Encuentra proyectos serios, bien pagados y de distintos sectores.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-6 bg-sky-50 rounded-2xl shadow-md hover:shadow-xl"
              >
                <Rocket className="w-12 h-12 text-sky-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-sky-700">
                  Crece Profesionalmente
                </h3>
                <p className="text-gray-600">
                  Potencia tu portafolio y construye relaciones laborales duraderas.
                </p>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ROLES */}
      <AnimatePresence>
        {showRoles && (
          <motion.section
            key="roles"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white py-16 px-6 rounded-t-3xl shadow-2xl space-y-12"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-center text-blue-700 mb-8"
            >
              Elige tu rol
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              {/* Cliente */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.6,
                  type: "spring",
                  bounce: 0.4,
                }}
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-blue-50 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  Cliente
                </h3>
                <p className="text-gray-600 mb-6">
                  ¿Buscas talento? Publica tus proyectos y encuentra al freelancer
                  ideal para tu negocio.
                </p>
                <button
                  onClick={() => setShowClientModal(true)}
                  className="w-full px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Ingresar
                </button>
              </motion.div>

              {/* Freelancer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.6,
                  type: "spring",
                  bounce: 0.4,
                }}
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-cyan-50 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-semibold text-cyan-600 mb-4">
                  Freelancer
                </h3>
                <p className="text-gray-600 mb-6">
                  ¿Quieres trabajar? Ofrece tus servicios, consigue proyectos y haz
                  crecer tu carrera profesional.
                </p>
                <button
                  onClick={() => setShowFreelancerModal(true)}
                  className="w-full px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                >
                  Ingresar
                </button>
              </motion.div>
            </div>

            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => setShowRoles(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Volver al inicio
              </button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* MODALES */}
      <AnimatePresence>
        {showClientModal && (
          <ClientAuthModal onClose={() => setShowClientModal(false)} />
        )}
        {showFreelancerModal && (
          <FreelancerAuthModal onClose={() => setShowFreelancerModal(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}