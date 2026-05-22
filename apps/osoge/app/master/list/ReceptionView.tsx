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
      <div className="flex items-center justify-between mt-4 gap-4">
        <div className="flex gap-2">
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
          className="h-9 px-3 text-sm w-56 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* 목록 */}
      <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">접수번호</th>
              <th className="text-left px-4 py-3 font-medium">핸드폰번호</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">접수일</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">
                  접수 내역이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const displayPhone =
                  search.trim() ? r.phone : maskPhone(r.phone);
                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-700">
                      <Highlight text={r.id} search={search} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <Highlight text={displayPhone} search={search} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[r.status]}`}
                      >
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(r.date)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/master/list/${r.id}`}
                        className="text-point text-xs font-medium hover:underline"
                      >
                        자세히보기
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-400 text-right">
        총 {filtered.length}건
        {receptions.length !== filtered.length &&
          ` (전체 ${receptions.length}건)`}
      </p>
    </div>
  );
}
