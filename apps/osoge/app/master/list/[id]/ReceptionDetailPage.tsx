"use client";

import { useRouter } from "next/navigation";
import ReceptionDetailView, { type ReceptionDetail } from "./ReceptionDetailView";

export default function ReceptionDetailPage({
  reception,
}: {
  reception: ReceptionDetail;
}) {
  const router = useRouter();

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <ReceptionDetailView
          reception={reception}
          onClose={() => router.push("/master/list")}
          mode="page"
        />
      </div>
    </main>
  );
}
