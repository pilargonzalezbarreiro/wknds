import { SR, SRS } from "@/types";

const EMAIL_MAP: Record<string, string> = {
  gonza: "gonza@wknds.app",
  lola: "lola@wknds.app",
  pili: "pili@wknds.app",
  roma: "roma@wknds.app",
  sofi: "sofi@wknds.app",
};

export function nombreToEmail(nombre: string): string | null {
  return EMAIL_MAP[nombre.toLowerCase()] ?? null;
}

export function emailToNombre(email: string): string {
  const entry = Object.entries(EMAIL_MAP).find(([, v]) => v === email);
  return entry ? capitalize(entry[0]) : email;
}

export function isValidSR(nombre: string): nombre is SR {
  return SRS.includes(nombre as SR);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
