import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Faltan variables de entorno. Verificá .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USUARIOS = [
  { nombre: "Gonza", email: "gonza@wknds.app", password: "gbsr26c" },
  { nombre: "Lola",  email: "lola@wknds.app",  password: "dmsr26mdq" },
  { nombre: "Pili",  email: "pili@wknds.app",  password: "pgbsr26caba" },
  { nombre: "Roma",  email: "roma@wknds.app",  password: "rbsr26r" },
  { nombre: "Sofi",  email: "sofi@wknds.app",  password: "srsr26a" },
];

async function main() {
  for (const u of USUARIOS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email, password: u.password,
      email_confirm: true,
      user_metadata: { nombre: u.nombre },
    });
    if (error) console.error(`✗ ${u.nombre}:`, error.message);
    else console.log(`✓ ${u.nombre} (${data.user.id})`);
  }
}
main().catch(console.error);