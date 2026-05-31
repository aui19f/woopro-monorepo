"use client";

import { usePathname } from "next/navigation";
import MasterFooterNav from "./MasterFooterNav";

export default function MasterLayoutClient({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const pathname = usePathname();
  const isKiosk = pathname.startsWith("/master/reception/kiosk");

  return (
    <>
      <main className={`flex-1 overflow-y-auto ${isKiosk ? "" : "pb-16"}`}>
        {children}
      </main>
      {!isKiosk && <MasterFooterNav userId={userId} />}
    </>
  );
}
