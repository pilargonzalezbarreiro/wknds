import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { emailToNombre } from "@/lib/auth";
import NavBar from "@/components/NavBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const nombreUsuario = emailToNombre(user.email ?? "");

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar nombreUsuario={nombreUsuario} />
      <main className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
