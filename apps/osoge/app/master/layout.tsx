import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@repo/auth/server";
import UnauthorizedAlert from "@/app/components/UnauthorizedAlert";
import MasterLayoutClient from "./_components/MasterLayoutClient";

export default async function MasterLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="relative flex flex-col h-[100dvh] bg-white">
      <Suspense>
        <UnauthorizedAlert />
      </Suspense>
      <MasterLayoutClient userId={user.id}>
        {children}
        {modal}
      </MasterLayoutClient>
    </div>
  );
}
