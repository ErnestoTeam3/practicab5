// src/app/api/freelancer/update/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // ✅ usar la instancia central

export async function PUT(req: Request) {
  try {
    const { id, name, skills, profilePic } = await req.json();

    if (id === undefined) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const updated = await prisma.freelancer.update({
      where: { id: Number(id) },
      data: {
        name: name || undefined,
        skills: skills || undefined,
        profilePic: profilePic || undefined,
      },
    });

    const { password, ...freelancerData } = updated; // no devolver la contraseña
    return NextResponse.json(freelancerData, { status: 200 });
  } catch (error: any) {
    console.error("Error al actualizar freelancer:", error.message);

    if (error.message.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "No se pudo conectar a la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
