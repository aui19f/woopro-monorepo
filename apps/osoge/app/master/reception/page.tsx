"use client";

import { useRouter } from "next/navigation";

const KioskIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth={2} />
  </svg>
);

const AdminIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function ReceptionPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-80 flex flex-col gap-5">
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-slate-800">접수 모드 선택</h2>
          <p className="text-sm text-slate-400 mt-1">운영 방식을 선택해주세요</p>
        </div>

        {/* 키오스크 모드 */}
        <button
          onClick={() => router.push("/master/reception/kiosk")}
          className="flex flex-col items-center gap-3 h-28 rounded-2xl bg-point text-white font-semibold transition-all active:scale-95 hover:opacity-90"
        >
          <span className="mt-5"><KioskIcon /></span>
          <span className="text-lg">키오스크 모드</span>
        </button>

        {/* 관리자 접수 모드 */}
        <button
          onClick={() => router.push("/master/reception/admin")}
          className="flex flex-col items-center gap-3 h-28 rounded-2xl border-2 border-point text-point font-semibold transition-all active:scale-95 hover:bg-slate-50"
        >
          <span className="mt-5"><AdminIcon /></span>
          <span className="text-lg">관리자 접수 모드</span>
        </button>
      </div>
    </div>
  );
}
