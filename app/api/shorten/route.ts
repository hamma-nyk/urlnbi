import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { url, alias } = await req.json();

  const shortCode = alias && alias.trim() !== "" 
    ? alias 
    : Math.random().toString(36).substring(2, 8);

  // Cek kalau alias sudah ada
  const { data: existing } = await supabase
    .from("urls")
    .select("short_code")
    .eq("short_code", shortCode)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Alias sudah dipakai, coba yang lain." }, { status: 400 });
  }

  await supabase.from("urls").insert([{ short_code: shortCode, long_url: url }]);

  return NextResponse.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
}