import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join } from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const ESTADOS_VALIDOS = ["Aceptado","Rechazado","Waiting list 1","Waiting list 2","Waiting list 3"];

async function main() {
  const content = readFileSync(join(process.cwd(), "data.csv"), "utf-8");
  const rows = parse(content, { columns: true, skip_empty_lines: true, trim: true }) as Record<string, string>[];
  console.log(`${rows.length} registros encontrados.`);

  const data = rows.map((r) => ({
    id: parseInt(r.id, 10),
    url: r.url || null,
    estado: ESTADOS_VALIDOS.includes(r.estado) ? r.estado : null,
    tanda: r.tanda ? parseInt(r.tanda, 10) : null,
    comentarios: r.comentarios || "",
    top_mid_bot: r.top_mid_bot || null,
    pais_origen: r.pais_origen || null,
    sr: null,
  }));

  for (let i = 0; i < data.length; i += 100) {
    const { error } = await supabase.from("participantes").upsert(data.slice(i, i+100), { onConflict: "id" });
    if (error) console.error("Error:", error.message);
    else console.log(`Lote ${i+1}-${Math.min(i+100, data.length)} OK`);
  }
}
main().catch(console.error);