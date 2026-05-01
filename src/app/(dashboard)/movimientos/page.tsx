import { createClient } from "@/lib/supabase/server";
import MovimientosClient from "@/components/MovimientosClient";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

export default async function MovimientosPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { pagina } = await searchParams;
  const currentPage = Math.max(1, parseInt(pagina ?? "1", 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const supabase = await createClient();
  const { data: movimientos, error, count } = await supabase
    .from("movimientos").select("*", { count: "exact" })
    .order("timestamp", { ascending: false }).range(from, from + PAGE_SIZE - 1);
  if (error) return <p className="text-red-600">Error: {error.message}</p>;
  return (
    <MovimientosClient
      movimientos={movimientos ?? []}
      currentPage={currentPage}
      totalPages={Math.ceil((count ?? 0) / PAGE_SIZE)}
      total={count ?? 0}
    />
  );
}