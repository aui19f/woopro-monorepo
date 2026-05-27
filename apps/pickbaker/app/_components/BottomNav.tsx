"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FeedIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" fill={active ? "currentColor" : "none"} />
    <path d="M9 21V12h6v9" />
  </svg>
);

const RecipeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill={active ? "currentColor" : "none"} />
    {active && <path d="M8 7h8M8 11h6" stroke="white" strokeWidth={2} />}
    {!active && <path d="M8 7h8M8 11h6" />}
  </svg>
);

const WriteIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
    <path d="M18.37 2.63a2 2 0 0 1 2.83 2.83L12 14.5 8 16l1.5-4 8.87-8.87z" />
  </svg>
);

const OfflineIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" fill={active ? "currentColor" : "none"} />
    <circle cx="12" cy="10" r="3" fill={active ? "white" : "none"} stroke={active ? "white" : "currentColor"} strokeWidth={1.5} />
  </svg>
);

const MyPageIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" fill={active ? "currentColor" : "none"} />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const NAV_ITEMS = [
  { label: "피드",    href: "/feed",    Icon: FeedIcon    },
  { label: "레시피",  href: "/recipe",  Icon: RecipeIcon  },
  { label: "오프라인", href: "/offline", Icon: OfflineIcon },
] as const;

interface BottomNavProps {
  userId?: string;
}

export default function BottomNav({ userId }: BottomNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  const mypageHref = userId ? `/${userId}` : "/login";
  const mypageActive = userId ? pathname.startsWith(`/${userId}`) : false;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-stone-200 flex items-center z-50">
      {/* 피드 · 레시피 */}
      {NAV_ITEMS.slice(0, 2).map(({ label, href, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
              active ? "text-point" : "text-stone-400"
            }`}
          >
            <Icon active={active} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}

      {/* 글쓰기 — 중앙 특별 버튼 */}
      <Link
        href="/write"
        className="flex flex-col items-center justify-center flex-1 h-full"
      >
        <div className="w-11 h-11 rounded-2xl bg-point flex items-center justify-center shadow-md text-white">
          <WriteIcon />
        </div>
        <span className="text-[10px] font-medium text-point mt-0.5">글쓰기</span>
      </Link>

      {/* 오프라인 */}
      {NAV_ITEMS.slice(2).map(({ label, href, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
              active ? "text-point" : "text-stone-400"
            }`}
          >
            <Icon active={active} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}

      {/* 마이페이지 */}
      <Link
        href={mypageHref}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
          mypageActive ? "text-point" : "text-stone-400"
        }`}
      >
        <MyPageIcon active={mypageActive} />
        <span className="text-[10px] font-medium">마이페이지</span>
      </Link>
    </nav>
  );
}
