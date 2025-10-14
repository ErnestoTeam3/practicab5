"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="bg-gray-900 text-white py-10 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Logo + Info empresa */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400">Team3</h2>
          <p className="text-gray-400 mt-3 text-sm">
            Conectamos freelancers con empresas para crear proyectos increíbles.  
            Tu talento, nuestra misión 🚀
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Enlaces</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-yellow-300 transition">
                Acerca de
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-yellow-300 transition">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-yellow-300 transition">
                Privacidad
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-yellow-300 transition">
                Términos y Condiciones
              </Link>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Síguenos</h3>
          <div className="flex justify-center md:justify-start space-x-5 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
              <FaLinkedinIn />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
              <FaInstagram />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Team3. Todos los derechos reservados.
      </div>
    </motion.footer>
  );
}
