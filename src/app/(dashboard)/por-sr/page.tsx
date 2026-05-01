import { createClient } from "@/lib/supabase/server";
import PorSRClient from "@/components/PorSRClient";

export const dynamic = "force-dynamic";

export default async function PorSRPage() {
  const supabase = await createClient();
  const { data: participantes, error } = await supabase
    .from("participantes").select("*").eq("estado", "Aceptado").order("id", { ascending: true });
  if (error) return <p className="text-red-600">Error: {error.message}</p>;
  return <PorSRClient participantes={participantes ?? []} />;
}
