// src/app/api/freelancer/active/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // ✅ usar la instancia central

export async function GET() {
  try {
    const freelancers = await prisma.freelancer.findMany({
      where: { isActive: true }, // solo activos
      select: {
        id: true,
        name: true,
        skills: true,
        profilePic: true,
      },
    });

    return NextResponse.json(freelancers, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching freelancers:", error.message);

    if (error.message.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "No se pudo conectar a la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Error al obtener freelancers" }, { status: 500 });
  }
}
