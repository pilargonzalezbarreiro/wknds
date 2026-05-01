import { createClient } from "@/lib/supabase/server";
import { emailToNombre } from "@/lib/auth";
import ParticipantesTable from "@/components/ParticipantesTable";
import { SRS, SR_LIMIT } from "@/types";

export const dynamic = "force-dynamic";

export default async function ParticipantesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const nombreUsuario = emailToNombre(user?.email ?? "");
  const { data: participantes, error } = await supabase
    .from("participantes").select("*").order("id", { ascending: true });
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  const conteoSR = Object.fromEntries(
    SRS.map((sr) => [sr, (participantes ?? []).filter((p) => p.sr === sr && p.estado === "Aceptado").length])
  ) as Record<string, number>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {SRS.map((sr) => {
          const count = conteoSR[sr] ?? 0;
          const colorClass = count >= SR_LIMIT
            ? "bg-red-100 text-red-700 border-red-200"
            : count >= SR_LIMIT * 0.8
            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : "bg-green-50 text-green-700 border-green-200";
          return (
            <div key={sr} className={`border rounded px-3 py-1.5 text-sm font-medium ${colorClass}`}>
              {sr}: {count}/{SR_LIMIT}{count >= SR_LIMIT && " ✗ lleno"}
            </div>
          );
        })}
      </div>
      <ParticipantesTable initialData={participantes ?? []} nombreUsuario={nombreUsuario} conteoSR={conteoSR} />
    </div>
  );
}