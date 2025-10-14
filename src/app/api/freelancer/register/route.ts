// src/app/api/freelancer/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, skills, profilePic, email, password } = await req.json();

    if (!name || !skills || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados" },
        { status: 400 }
      );
    }

    // ✅ Verificar si el correo ya está registrado
    const existingFreelancer = await prisma.freelancer.findUnique({
      where: { email },
    });
    if (existingFreelancer) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // 🔒 Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📝 Crear freelancer en la base de datos
    const freelancer = await prisma.freelancer.create({
      data: {
        name,
        skills,
        profilePic,
        email,
        password: hashedPassword,
        isActive: false,
      },
    });

    // ❌ No devolver la contraseña
    const { password: _, ...freelancerData } = freelancer;

    return NextResponse.json(freelancerData, { status: 201 });
  } catch (error: any) {
    console.error("Register error:", error);

    if (error.message.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "No se pudo conectar a la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error creando freelancer" },
      { status: 500 }
    );
  }
}
