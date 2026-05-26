export default function OfflinePage() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-stone-800 mb-4">오프라인</h1>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 px-4 py-4 flex gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-xl bg-stone-100 shrink-0 flex items-center justify-center text-stone-300 text-xs">
              이미지
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800">오프라인 이벤트 {i + 1}</p>
              <p className="text-xs text-stone-400 mt-1">2026.06.0{i + 1} · 서울 강남구</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium">
                모집 중
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
