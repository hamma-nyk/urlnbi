import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const MAX_DB_SIZE = 500 * 1024 * 1024; // 500 MB
const AVG_ROW_SIZE = 500; // fallback approx 500 byte/row

export async function GET() {
  try {
    // Coba metode akurat dulu
    const { data: size, error } = await supabase.rpc("get_table_size", {
      table_name: "urls",
    });

    if (!error && size) {
      const percentage = Math.min((Number(size) / MAX_DB_SIZE) * 100, 100);

      return NextResponse.json({
        method: "accurate",
        estimatedSize: Number(size),
        maxSize: MAX_DB_SIZE,
        percentage,
      });
    }

    // --- Fallback ke metode estimasi ---
    const { count, error: countError } = await supabase
      .from("urls")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const estimatedSize = (count || 0) * AVG_ROW_SIZE;
    const percentage = Math.min((estimatedSize / MAX_DB_SIZE) * 100, 100);

    return NextResponse.json({
      method: "estimate",
      totalRows: count,
      estimatedSize,
      maxSize: MAX_DB_SIZE,
      percentage,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}