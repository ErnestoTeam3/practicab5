// src/app/api/client/update/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // ✅ usar la instancia central

export async function PUT(req: Request) {
  try {
    const { id, companyName, projectName, projectDesc, profilePic } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const updated = await prisma.client.update({
      where: { id: Number(id) }, // asegurarse de que sea un número
      data: {
        companyName: companyName || undefined,
        projectName: projectName || undefined,
        projectDesc: projectDesc || undefined,
        profilePic: profilePic || undefined,
      },
    });

    const { password: _, ...clientData } = updated; // no devolver la contraseña
    return NextResponse.json(clientData, { status: 200 });
  } catch (error: any) {
    console.error("Error al actualizar cliente:", error.message);

    if (error.message.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "No se pudo conectar a la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
