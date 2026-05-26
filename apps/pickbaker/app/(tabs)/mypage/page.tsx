export default function MyPage() {
  return (
    <div className="px-4 pt-6">
      {/* 프로필 */}
      <div className="flex items-center gap-4 bg-white rounded-2xl border border-stone-100 px-5 py-5 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-stone-100 shrink-0" />
        <div>
          <p className="text-base font-bold text-stone-800">닉네임</p>
          <p className="text-xs text-stone-400 mt-0.5">pickbaker@example.com</p>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="mt-4 bg-white rounded-2xl border border-stone-100 divide-y divide-stone-100 shadow-sm">
        {["내 게시글", "북마크", "팔로잉", "알림 설정", "로그아웃"].map((item) => (
          <button
            key={item}
            className="w-full flex items-center justify-between px-5 py-4 text-sm text-stone-700"
          >
            {item}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
