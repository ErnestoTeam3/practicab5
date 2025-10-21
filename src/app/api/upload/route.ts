import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // <- aquí usamos la Role Key

// Creamos el cliente con la Role Key
const supabase = createClient(supabaseUrl, supabaseRoleKey);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("chat_files")
    .upload(fileName, buffer, { contentType: file.type });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: publicUrlData } = supabase.storage.from("chat_files").getPublicUrl(fileName);
  return NextResponse.json({ url: publicUrlData.publicUrl });
}
