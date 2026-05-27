import { createSupabaseServerClient } from "@repo/auth/server";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/app/_components/BottomNav";

export default async function TabsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let username: string | undefined;
  if (user) {
    const profile = await prisma.user.findUnique({ where: { auth_id: user.id }, select: { username: true } });
    username = profile?.username;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-base">
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>
      <BottomNav userId={username} />
    </div>
  );
}
