import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Validación DENTRO de la función (runtime, no build time)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "SUPABASE_URL no está configurado" },
        { status: 500 }
      );
    }

    if (!supabaseRoleKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY no está configurado" },
        { status: 500 }
      );
    }

    // Cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseRoleKey);

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    // Convertir a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    // Subir archivo al bucket 'chat_files'
    const { error: uploadError } = await supabase.storage
      .from("chat_files")
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Crear Signed URL con validez de 1 hora
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