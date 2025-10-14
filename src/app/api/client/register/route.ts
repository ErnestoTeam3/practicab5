// src/app/api/client/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // ✅ usar la instancia central
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { companyName, projectName, projectDesc, profilePic, email, password } = await req.json();

    if (!companyName || !projectName || !projectDesc || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados" },
        { status: 400 }
      );
    }

    // Verificar si el correo ya existe
    const existingClient = await prisma.client.findUnique({ where: { email } });
    if (existingClient) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo cliente
    const newClient = await prisma.client.create({
      data: {
        companyName,
        projectName,
        projectDesc,
        profilePic,
        email,
        password: hashedPassword,
      },
    });

    // No devolver la contraseña
    const { password: _, ...clientData } = newClient;
    return NextResponse.json(clientData, { status: 201 });
  } catch (error: any) {
    console.error("Register error:", error);
    if (error.message.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "No se pudo conectar a la base de datos" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Error al registrar cliente" }, { status: 500 });
  }
}
