import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body;
  const shortCode = Math.random().toString(36).substring(2, 8);

  const { error } = await supabase.from("urls").insert([
    { short_code: shortCode, long_url: url }
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
}
