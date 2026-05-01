"use client";
import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Participante, Estado, SR, ESTADOS, SRS, SR_LIMIT } from "@/types";

const ESTADO_COLORS: Record<string, string> = {
  Aceptado: "bg-green-100 text-green-800",
  Rechazado: "bg-red-100 text-red-800",
  "Waiting list 1": "bg-yellow-100 text-yellow-800",
  "Waiting list 2": "bg-orange-100 text-orange-800",
  "Waiting list 3": "bg-green-800 text-white",
};
const TOP_MID_BOT_COLORS: Record<string, string> = {
  Top: "bg-green-700 text-white",
  Mid: "bg-yellow-100 text-yellow-800",
  Bottom: "bg-red-600 text-white",
};

export default function ParticipantesTable({
  initialData, nombreUsuario, conteoSR: initialConteoSR,
}: { initialData: Participante[]; nombreUsuario: string; conteoSR: Record<string, number> }) {
  const [participantes, setParticipantes] = useState(initialData);
  const [conteoSR, setConteoSR] = useState(initialConteoSR);
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [filterEstado, setFilterEstado] = useState("");
  const [filterPais, setFilterPais] = useState("");
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const logMovimiento = useCallback(async (
    participanteId: number, campo: string,
    valorAnterior: string | null, valorNuevo: string | null
  ) => {
    await supabase.from("movimientos").insert({
      usuario: nombreUsuario, participante_id: participanteId,
      campo, valor_anterior: valorAnterior, valor_nuevo: valorNuevo,
    });
  }, [supabase, nombreUsuario]);

  const actualizarCampo = useCallback(async (
    id: number, campo: keyof Participante,
    valor: string | null, valorAnterior: string | null
  ) => {
    setSaving((s) => ({ ...s, [id]: true }));
    setErrors((e) => ({ ...e, [id]: "" }));
    const { error } = await supabase.from("participantes").update({ [campo]: valor }).eq("id", id);
    if (error) {
      setErrors((e) => ({ ...e, [id]: error.message }));
    } else {
      await logMovimiento(id, campo, valorAnterior, valor);
      setParticipantes((prev) => prev.map((p) => p.id === id ? { ...p, [campo]: valor } : p));
      if (campo === "estado" || campo === "sr") {
        setConteoSR((prev) => {
          const next = { ...prev };
          const updated = { ...participantes.find((p) => p.id === id)!, [campo]: valor };
          SRS.forEach((sr) => {
            next[sr] = participantes.map((p) => p.id === id ? updated : p)
              .filter((p) => p.sr === sr && p.estado === "Aceptado").length;
          });
          return next;
        });
      }
    }
    setSaving((s) => ({ ...s, [id]: false }));
  }, [supabase, logMovimiento, participantes]);

  const handleEstadoChange = useCallback(async (p: Participante, nuevoEstado: Estado | "") => {
    if (!nuevoEstado) return;
    if (p.estado === "Aceptado" && nuevoEstado !== "Aceptado")
      await actualizarCampo(p.id, "sr", null, p.sr);
    await actualizarCampo(p.id, "estado", nuevoEstado, p.estado);
  }, [actualizarCampo]);

  const handleSRChange = useCallback(async (p: Participante, nuevoSR: SR | "") => {
    if (p.estado !== "Aceptado") return;
    if (nuevoSR && conteoSR[nuevoSR] >= SR_LIMIT && p.sr !== nuevoSR) {
      setErrors((e) => ({ ...e, [p.id]: `${nuevoSR} ya alcanzó el límite de ${SR_LIMIT}.` }));
      return;
    }
    await actualizarCampo(p.id, "sr", nuevoSR || null, p.sr);
  }, [actualizarCampo, conteoSR]);

  const handleComentariosBlur = useCallback(async (p: Participante, valor: string) => {
    if (valor === (p.comentarios ?? "")) return;
    await actualizarCampo(p.id, "comentarios", valor, p.comentarios);
  }, [actualizarCampo]);

  const paises = [...new Set(participantes.map((p) => p.pais_origen).filter(Boolean))].sort();
  const filtrados = participantes.filter((p) => {
    if (filterEstado && p.estado !== filterEstado) return false;
    if (filterPais && p.pais_origen !== filterPais) return false;
    if (search) {
      const q = search.toLowerCase();
      return String(p.id).includes(q) || (p.comentarios ?? "").toLowerCase().includes(q) || (p.pais_origen ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input type="text" placeholder="Buscar por ID, país, comentario..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="select-cell">
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <select value={filterPais} onChange={(e) => setFilterPais(e.target.value)} className="select-cell">
          <option value="">Todos los países</option>
          {paises.map((p) => <option key={p!} value={p!}>{p}</option>)}
        </select>
        <span className="text-sm text-gray-500">{filtrados.length} de {participantes.length}</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["ID","URL","Estado","Tanda","Comentarios","Top/Mid/Bot","País","SR"].map((h) => (
                <th key={h} className="table-cell font-semibold text-left text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtrados.map((p) => (
              <tr key={p.id} className={`hover:bg-gray-50 ${saving[p.id] ? "opacity-60" : ""}`}>
                <td className="table-cell font-mono text-gray-500">{p.id}</td>
                <td className="table-cell">
                  {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline truncate max-w-xs block">
                    {p.url.replace(/https?:\/\/[^/]+/, "")}
                  </a> : <span className="text-gray-300">—</span>}
                </td>
                <td className="table-cell">
                  <select value={p.estado ?? ""} disabled={saving[p.id]}
                    onChange={(e) => handleEstadoChange(p, e.target.value as Estado)}
                    className={`select-cell w-full ${p.estado ? ESTADO_COLORS[p.estado] : ""}`}>
                    <option value="">— Sin estado —</option>
                    {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </td>
                <td className="table-cell text-center text-gray-700">{p.tanda ?? "—"}</td>
                <td className="table-cell">
                  <input type="text" defaultValue={p.comentarios ?? ""} disabled={saving[p.id]}
                    onBlur={(e) => handleComentariosBlur(p, e.target.value)}
                    className="w-full border border-transparent hover:border-gray-200 focus:border-indigo-400 rounded px-2 py-0.5 bg-transparent focus:bg-white focus:outline-none text-sm min-w-32" />
                </td>
                <td className="table-cell">
                  {p.top_mid_bot
                    ? <span className={`px-2 py-0.5 rounded text-xs font-semibold ${TOP_MID_BOT_COLORS[p.top_mid_bot] ?? "bg-gray-100 text-gray-700"}`}>{p.top_mid_bot}</span>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="table-cell text-gray-700">{p.pais_origen ?? "—"}</td>
                <td className="table-cell">
                  {p.estado === "Aceptado" ? (
                    <select value={p.sr ?? ""} disabled={saving[p.id]}
                      onChange={(e) => handleSRChange(p, e.target.value as SR | "")}
                      className={`select-cell w-full ${!p.sr ? "border-red-300 bg-red-50" : ""}`}>
                      <option value="">— Asignar —</option>
                      {SRS.map((sr) => (
                        <option key={sr} value={sr} disabled={conteoSR[sr] >= SR_LIMIT && p.sr !== sr}>
                          {sr}{conteoSR[sr] >= SR_LIMIT && p.sr !== sr ? " (lleno)" : ""}
                        </option>
                      ))}
                    </select>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && <div className="text-center py-10 text-gray-400">No hay participantes que coincidan.</div>}
      </div>
      {Object.entries(errors).map(([id, msg]) => msg && <p key={id} className="text-sm text-red-600">ID {id}: {msg}</p>)}
    </div>
  );
}