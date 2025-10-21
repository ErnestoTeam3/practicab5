import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validación rápida para build/runtime
if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL no está definido");
if (!supabaseRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY no está definido");

// Cliente de Supabase con Role Key (backend)
const supabase = createClient(supabaseUrl, supabaseRoleKey);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    // Convertir a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from("chat_files")
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Crear Signed URL (opcionalmente 1 hora de validez)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from("chat_files")
      .createSignedUrl(fileName, 60 * 60);

    if (urlError) {
      return NextResponse.json({ error: urlError.message }, { status: 500 });
    }

    return NextResponse.json({ url: signedUrlData.signedUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error desconocido" }, { status: 500 });
  }
}
