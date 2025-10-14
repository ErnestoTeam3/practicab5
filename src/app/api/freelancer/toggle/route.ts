// src/app/api/freelancer/toggle/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // ✅ usar la instancia central

export async function PUT(req: Request) {
  try {
    // Leer datos del body
    const { id, isActive } = await req.json();

    if (id === undefined) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    // Actualizar el estado de disponibilidad
    const updated = await prisma.freelancer.update({
      where: { id: Number(id) }, // convertir a número
      data: { isActive: Boolean(isActive) },
    });

    // Quitar password antes de devolver
    const { password, ...freelancerData } = updated;

    return NextResponse.json(freelancerData, { status: 200 });
  } catch (error: any) {
    console.error("Error al actualizar disponibilidad:", error.message);

    // Diferenciar error de conexión
    if (error.message.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "No se pudo conectar a la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
