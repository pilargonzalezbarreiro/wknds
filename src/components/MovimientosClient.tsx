"use client";
import Link from "next/link";
import { Movimiento } from "@/types";

const CAMPO_LABELS: Record<string, string> = { estado: "Estado", sr: "SR", comentarios: "Comentarios" };

function formatTs(ts: string) {
  return new Date(ts).toLocaleString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function MovimientosClient({
  movimientos, currentPage, totalPages, total,
}: { movimientos: Movimiento[]; currentPage: number; totalPages: number; total: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Últimos movimientos</h2>
        <span className="text-sm text-gray-500">{total} registros</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Fecha/hora","Usuario","ID","Campo","Antes","Después"].map((h) => (
                <th key={h} className="table-cell font-semibold text-left text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movimientos.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="table-cell text-gray-500 font-mono text-xs">{formatTs(m.timestamp)}</td>
                <td className="table-cell font-medium text-indigo-700">{m.usuario}</td>
                <td className="table-cell font-mono text-gray-600">{m.participante_id}</td>
                <td className="table-cell text-gray-700">{CAMPO_LABELS[m.campo] ?? m.campo}</td>
                <td className="table-cell">
                  {m.valor_anterior
                    ? <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs">{m.valor_anterior}</span>
                    : <span className="text-gray-300 text-xs">vacío</span>}
                </td>
                <td className="table-cell">
                  {m.valor_nuevo
                    ? <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">{m.valor_nuevo}</span>
                    : <span className="text-gray-300 text-xs">vacío</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {movimientos.length === 0 && <div className="text-center py-10 text-gray-400">No hay movimientos registrados aún.</div>}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && <Link href={`/movimientos?pagina=${currentPage - 1}`} className="btn-ghost text-sm">← Anterior</Link>}
          <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
          {currentPage < totalPages && <Link href={`/movimientos?pagina=${currentPage + 1}`} className="btn-ghost text-sm">Siguiente →</Link>}
        </div>
      )}
    </div>
  );
}