export default function RecipePage() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-stone-800 mb-4">레시피</h1>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
            <div className="aspect-square bg-stone-100 flex items-center justify-center text-stone-300 text-sm">
              이미지
            </div>
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-stone-800 truncate">레시피 {i + 1}</p>
              <p className="text-xs text-stone-400 mt-0.5">베이커리</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
