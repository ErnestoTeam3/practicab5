import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

import bcrypt from "bcryptjs"; // 👈 usa bcryptjs en vez de bcrypt (mejor compatibilidad en Next.js)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 🔒 Validar campos vacíos
    if (!email || !password) {
      return NextResponse.json({ error: "Correo y contraseña requeridos" }, { status: 400 });
    }

    // 🔍 Buscar freelancer por correo
    const freelancer = await prisma.freelancer.findUnique({
      where: { email },
    });

    if (!freelancer) {
      return NextResponse.json({ error: "Correo no encontrado" }, { status: 401 });
    }

    // 🔐 Comparar contraseña encriptada
    const validPassword = await bcrypt.compare(password, freelancer.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    // 🟢 Actualizar estado activo al iniciar sesión
    const updatedFreelancer = await prisma.freelancer.update({
      where: { id: freelancer.id },
      data: { isActive: true },
    });

    // 🧹 Excluir el campo password antes de devolver
    const { password: _, ...freelancerData } = updatedFreelancer;

    return NextResponse.json(freelancerData, { status: 200 });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
