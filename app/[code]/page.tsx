import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

interface Props {
  params: { code: string };
}

export default async function RedirectPage({ params }: Props) {
  const code = params?.code;
  if (!code) {
    return <p className="text-center mt-10">400 - Bad Request</p>;
  }

  // Gunakan maybeSingle agar tidak throw error kalau tidak ada row
  const { data, error } = await supabase
    .from("urls")
    .select("long_url")
    .eq("short_code", code)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);
    return <p className="text-center mt-10">Terjadi kesalahan server</p>;
  }

  if (!data?.long_url) {
    return <p className="text-center mt-10">404 - Not Found</p>;
  }

  // Normalisasi URL (tambah https:// kalau belum ada)
  const longUrl = /^https?:\/\//i.test(data.long_url)
    ? data.long_url
    : `https://${data.long_url}`;

  // (Opsional) increment click counter secara terpisah menggunakan service key
  // await supabase.from("urls").update({ clicks: supabase.rpc('increment_clicks', { code }) }).eq('short_code', code);

  redirect(longUrl);
}