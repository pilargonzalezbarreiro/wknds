export type Estado = "Aceptado" | "Rechazado" | "Waiting list 1" | "Waiting list 2" | "Waiting list 3";
export type SR = "Gonza" | "Lola" | "Pili" | "Roma" | "Sofi";

export const ESTADOS: Estado[] = ["Aceptado","Rechazado","Waiting list 1","Waiting list 2","Waiting list 3"];
export const SRS: SR[] = ["Gonza","Lola","Pili","Roma","Sofi"];
export const SR_LIMIT = 20;

export interface Participante {
  id: number; url: string | null; estado: Estado | null;
  tanda: number | null; comentarios: string | null;
  top_mid_bot: string | null; pais_origen: string | null;
  sr: SR | null; created_at: string; updated_at: string;
}

export interface Movimiento {
  id: string; timestamp: string; usuario: string;
  participante_id: number; campo: string;
  valor_anterior: string | null; valor_nuevo: string | null;
}