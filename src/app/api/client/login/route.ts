// src/app/api/client/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const client = await prisma.client.findUnique({ where: { email } });

    if (!client) {
      return NextResponse.json({ error: "Correo no encontrado" }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, client.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    const { password: _, ...clientData } = client;
    return NextResponse.json(clientData, { status: 200 });
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.message.includes("Can't reach database")) {
      return NextResponse.json({ error: "No se pudo conectar a la base de datos" }, { status: 500 });
    }
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
