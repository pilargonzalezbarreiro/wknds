"use client";
import { useState } from "react";
import { Participante, SRS, SR, SR_LIMIT } from "@/types";

const TMB: Record<string, string> = {
  Top: "bg-green-700 text-white", Mid: "bg-yellow-100 text-yellow-800", Bottom: "bg-red-600 text-white",
};

export default function PorSRClient({ participantes }: { participantes: Participante[] }) {
  const [srSeleccionado, setSrSeleccionado] = useState<SR>(SRS[0]);
  const filtrados = participantes.filter((p) => p.sr === srSeleccionado);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">SR:</label>
        <div className="flex gap-2">
          {SRS.map((sr) => {
            const count = participantes.filter((p) => p.sr === sr).length;
            return (
              <button key={sr} onClick={() => setSrSeleccionado(sr)}
                className={`px-4 py-1.5 rounded text-sm font-medium border transition-colors ${
                  srSeleccionado === sr
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}>
                {sr} <span className={`text-xs ml-1 ${srSeleccionado === sr ? "text-indigo-200" : "text-gray-400"}`}>{count}/{SR_LIMIT}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["ID","URL","Tanda","Comentarios","Top/Mid/Bot","País"].map((h) => (
                <th key={h} className="table-cell font-semibold text-left text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtrados.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="table-cell font-mono text-gray-500">{p.id}</td>
                <td className="table-cell">
                  {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline truncate max-w-xs block">
                    {p.url.replace(/https?:\/\/[^/]+/, "")}
                  </a> : <span className="text-gray-300">—</span>}
                </td>
                <td className="table-cell text-center">{p.tanda ?? "—"}</td>
                <td className="table-cell text-gray-700">{p.comentarios || "—"}</td>
                <td className="table-cell">
                  {p.top_mid_bot
                    ? <span className={`px-2 py-0.5 rounded text-xs font-semibold ${TMB[p.top_mid_bot] ?? "bg-gray-100 text-gray-700"}`}>{p.top_mid_bot}</span>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="table-cell text-gray-700">{p.pais_origen ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && <div className="text-center py-10 text-gray-400">{srSeleccionado} no tiene participantes aceptados aún.</div>}
      </div>
    </div>
  );
}