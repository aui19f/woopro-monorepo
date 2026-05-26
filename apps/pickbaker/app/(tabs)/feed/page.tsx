export default function FeedPage() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-stone-800 mb-4">피드</h1>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
            <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center text-stone-300 text-sm">
              이미지
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-stone-800">게시글 제목 {i + 1}</p>
              <p className="text-xs text-stone-400 mt-1">작성자 · 방금 전</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
