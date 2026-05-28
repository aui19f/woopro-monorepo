"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// db:generate 이후 @/generated/prisma에서 import 가능
type ReceptionStatus = "READY" | "IN_PROGRESS" | "DONE" | "CANCELLED";

type ReceptionItem = {
  id: string;
  phone: string;
  date: string;
  time: string;
  status: ReceptionStatus;
  agreed: boolean;
  message_sent_count: number;
  quantity: number;
  payment_amount: number | null;
  storeId: string | null;
};

const STATUS_LABEL: Record<ReceptionStatus, string> = {
  READY: "준비",
  IN_PROGRESS: "진행",
  DONE: "완료",
  CANCELLED: "취소",
};

const STATUS_STYLE: Record<ReceptionStatus, string> = {
  READY: "bg-blue-50 text-blue-600",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700",
  DONE: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-600",
};

const DATE_FILTERS = [
  { value: "today", label: "오늘" },
  { value: "week", label: "일주일" },

  { value: "custom", label: "월지정" },
  { value: "all", label: "전체" },
] as const;

const STATUSES: { value: ReceptionStatus; label: string; active: string }[] = [
  {
    value: "READY",
    label: "준비",
    active: "bg-blue-100 text-blue-600 border-blue-300",
  },
  {
    value: "IN_PROGRESS",
    label: "진행",
    active: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  {
    value: "DONE",
    label: "완료",
    active: "bg-green-100 text-green-700 border-green-300",
  },
  {
    value: "CANCELLED",
    label: "취소",
    active: "bg-red-100 text-red-600 border-red-300",
  },
];

function maskPhone(phone: string) {
  return phone.replace(
    /(\d{3})-(\d{3,4})-(\d{4})/,
    (_, p1, p2, p3) => `${p1}-${"*".repeat(p2.length)}-${p3}`
  );
}

function Highlight({ text, search }: { text: string; search: string }) {
  if (!search.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(search.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-bold text-point">
        {text.slice(idx, idx + search.length)}
      </strong>
      {text.slice(idx + search.length)}
    </>
  );
}

function formatDate(yyyymmdd: string) {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  return `${yyyymmdd.slice(0, 4)}.${yyyymmdd.slice(4, 6)}.${yyyymmdd.slice(6)}`;
}

const SERVICE_START_MONTH = "2026-05"; // 서비스 시작 연월

function currentYYYYMM() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
}

// 월지정 단일 셀렉트
function MonthPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (month: string) => void;
}) {
  const options = useMemo(() => {
    const list: { value: string; label: string }[] = [];
    const today = new Date();
    const [startYear, startMonth] = SERVICE_START_MONTH.split("-").map(
      Number
    ) as [number, number];
    const start = new Date(startYear, startMonth - 1, 1);

    const cur = new Date(today.getFullYear(), today.getMonth(), 1);
    while (cur >= start) {
      const val = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`;
      const label = `${cur.getFullYear()}년 ${cur.getMonth() + 1}월`;
      list.push({ value: val, label });
      cur.setMonth(cur.getMonth() - 1);
    }
    return list;
  }, []);

  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
      <span className="text-sm text-slate-500">월 선택</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border-slate-200 rounded-lg h-9 px-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ----------------------------------------------------------------

export default function ReceptionView({
  receptions,
  dateFilter,
  fromMonth,
  statusParam,
}: {
  receptions: ReceptionItem[];
  dateFilter: string;
  fromMonth: string;
  statusParam: string; // 쉼표 구분 "READY,DONE" | ""
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // 로컬 필터 상태 — 조회 버튼 클릭 전까지 URL에 반영하지 않음
  const [localDateFilter, setLocalDateFilter] = useState(dateFilter);
  const [localMonth, setLocalMonth] = useState(fromMonth);
  const [localStatuses, setLocalStatuses] = useState<Set<ReceptionStatus>>(
    () => new Set(statusParam.split(",").filter(Boolean) as ReceptionStatus[])
  );

  function applyFilters() {
    const url = new URL(window.location.href);
    url.searchParams.set("date", localDateFilter);
    if (localDateFilter === "custom" && localMonth) {
      url.searchParams.set("from", localMonth);
    } else {
      url.searchParams.delete("from");
    }
    const statusStr = Array.from(localStatuses).join(",");
    if (statusStr) url.searchParams.set("status", statusStr);
    else url.searchParams.delete("status");
    router.push(url.pathname + url.search);
  }

  function handleDateFilter(value: string) {
    setLocalDateFilter(value);
    if (value === "custom") {
      setLocalMonth(currentYYYYMM());
    }
  }

  function handleMonthChange(month: string) {
    setLocalMonth(month);
  }

  function toggleStatus(value: ReceptionStatus) {
    setLocalStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  // 검색만 클라이언트 사이드 처리
  const filtered = useMemo(() => {
    if (!search.trim()) return receptions;
    const q = search.toLowerCase();
    return receptions.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.phone.replace(/-/g, "").includes(q.replace(/-/g, ""))
    );
  }, [receptions, search]);

  // 현재 선택된 필터 요약 텍스트
  const dateLabel =
    DATE_FILTERS.find((f) => f.value === localDateFilter)?.label ??
    (localDateFilter === "custom" ? localMonth.replace("-", "년 ") + "월" : "");
  const statusLabels = Array.from(localStatuses)
    .map((s) => STATUS_LABEL[s])
    .join(", ");
  const filterSummary = [dateLabel, statusLabels].filter(Boolean).join(" · ");
  const totalAmount = filtered.reduce((sum, r) => sum + (r.payment_amount ?? 0), 0);

  return (
    <div>
      {/* 검색 바 */}
      <div className="flex gap-2 items-center">
        {/* 필터 토글 버튼 */}
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
            showFilters
              ? "bg-point text-white border-point"
              : "bg-white border-slate-200 text-slate-500"
          }`}
          aria-label="필터"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
        </button>

        <input
          type="text"
          placeholder="접수번호 또는 전화번호"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
        />

        <button
          onClick={applyFilters}
          className="h-10 px-5 rounded-lg bg-point text-white text-sm font-semibold shrink-0 active:opacity-80"
        >
          조회
        </button>
      </div>

      {/* 선택된 필터 요약 + 통계 */}
      <p className="mt-1.5 ml-12 text-xs text-slate-400">
        {filterSummary && `${filterSummary} | `}
        접수{filtered.length} / 총금액{totalAmount.toLocaleString()}원
      </p>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
          {/* 날짜 필터 */}
          <div className="flex gap-2 flex-wrap">
            {DATE_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleDateFilter(value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  localDateFilter === value
                    ? "bg-point text-white"
                    : "bg-white border border-slate-200 text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 월 선택 */}
          {localDateFilter === "custom" && (
            <MonthPicker value={localMonth} onChange={handleMonthChange} />
          )}

          {/* 상태 필터 */}
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(({ value, label, active }) => {
              const isActive = localStatuses.has(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleStatus(value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    isActive ? active : "border-slate-200 text-slate-500"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 카드 목록 */}
      <div className="mt-4 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            접수 내역이 없습니다.
          </div>
        ) : (
          filtered.map((r) => {
            const displayPhone = search.trim() ? r.phone : maskPhone(r.phone);
            return (
              <Link
                key={r.id}
                href={`/master/list/${r.id}`}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 hover:border-slate-300 hover:shadow-sm transition-all active:scale-[0.99]"
              >
                {/* 상태 바 */}
                <div
                  className={`w-1 self-stretch rounded-full shrink-0 ${
                    r.status === "READY"
                      ? "bg-blue-400"
                      : r.status === "IN_PROGRESS"
                        ? "bg-yellow-400"
                        : r.status === "DONE"
                          ? "bg-green-400"
                          : "bg-red-300"
                  }`}
                />

                {/* 본문 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm text-slate-500">
                      <Highlight text={r.id} search={search} />
                    </span>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLE[r.status]}`}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-slate-800 mt-0.5">
                    <Highlight text={displayPhone} search={search} />
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDate(r.date)}&nbsp;·&nbsp;{r.time.slice(0, 5)}
                    {r.quantity > 1 && <>&nbsp;·&nbsp;{r.quantity}개</>}
                  </p>
                </div>

                {/* 화살표 */}
                <svg
                  className="w-4 h-4 text-slate-300 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            );
          })
        )}
      </div>

      <p className="mt-3 text-xs text-slate-400 text-right">
        총 {filtered.length}건
        {receptions.length !== filtered.length &&
          ` (전체 ${receptions.length}건)`}
      </p>
    </div>
  );
}
