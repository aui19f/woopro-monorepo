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
  { value: "month", label: "한달" },
  { value: "custom", label: "월지정" },
  { value: "all", label: "전체" },
] as const;

const STATUSES: { value: ReceptionStatus; label: string; active: string }[] = [
  { value: "READY",       label: "준비", active: "bg-blue-100 text-blue-600 border-blue-300" },
  { value: "IN_PROGRESS", label: "진행", active: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "DONE",        label: "완료", active: "bg-green-100 text-green-700 border-green-300" },
  { value: "CANCELLED",   label: "취소", active: "bg-red-100 text-red-600 border-red-300" },
];

function maskPhone(phone: string) {
  return phone.replace(/(\d{3})-(\d{3,4})-(\d{4})/, (_, p1, p2, p3) =>
    `${p1}-${"*".repeat(p2.length)}-${p3}`
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
    const [startYear, startMonth] = SERVICE_START_MONTH.split("-").map(Number) as [number, number];
    const start = new Date(startYear, startMonth - 1, 1);

    let cur = new Date(today.getFullYear(), today.getMonth(), 1);
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
  const [localMonth, setLocalMonth] = useState(fromMonth);

  // URL에서 파생된 선택 상태 (UI 표시용)
  const selectedStatuses = useMemo<Set<ReceptionStatus>>(
    () =>
      new Set(
        statusParam
          .split(",")
          .filter(Boolean) as ReceptionStatus[]
      ),
    [statusParam]
  );

  function pushParams(updates: Record<string, string | null>) {
    const url = new URL(window.location.href);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    });
    router.push(url.pathname + url.search);
  }

  function handleDateFilter(value: string) {
    if (value === "custom") {
      const month = currentYYYYMM();
      setLocalMonth(month);
      pushParams({ date: "custom", from: month });
    } else {
      pushParams({ date: value, from: null });
    }
  }

  function handleMonthChange(month: string) {
    setLocalMonth(month);
    pushParams({ date: "custom", from: month || null });
  }

  function toggleStatus(value: ReceptionStatus) {
    const next = new Set(selectedStatuses);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    pushParams({ status: Array.from(next).join(",") || null });
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

  return (
    <div>
      {/* 날짜 필터 */}
      <div className="flex gap-2 flex-wrap">
        {DATE_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleDateFilter(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateFilter === value
                ? "bg-point text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 월 단일 선택 */}
      {dateFilter === "custom" && (
        <MonthPicker value={localMonth} onChange={handleMonthChange} />
      )}

      {/* 상태 필터 + 검색 */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(({ value, label, active }) => {
            const isActive = selectedStatuses.has(value);
            return (
              <button
                key={value}
                onClick={() => toggleStatus(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  isActive
                    ? active
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          placeholder="접수번호 또는 전화번호"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 px-3 text-sm w-full border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
        />
      </div>

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
                    r.status === "READY"       ? "bg-blue-400" :
                    r.status === "IN_PROGRESS" ? "bg-yellow-400" :
                    r.status === "DONE"        ? "bg-green-400" :
                                                 "bg-red-300"
                  }`}
                />

                {/* 본문 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm text-slate-500">
                      <Highlight text={r.id} search={search} />
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLE[r.status]}`}>
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
                <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
