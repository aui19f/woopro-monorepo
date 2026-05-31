"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Spinner from "@repo/ui/components/Spinner/Spinner";
import Toast from "@repo/ui/components/Toast/Toast";
import { useToast } from "@repo/ui/hooks/useToast";
import { registerExpense, type ExpenseState } from "./actions";

type Method = "CARD" | "CASH" | "PAY" | "OTHER";

const METHODS: { value: Method; label: string }[] = [
  { value: "CARD",  label: "카드" },
  { value: "CASH",  label: "현금" },
  { value: "PAY",   label: "페이" },
  { value: "OTHER", label: "그외" },
];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isoToYYYYMMDD(iso: string) {
  return iso.replace(/-/g, "");
}

function isoToDisplay(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export default function ExpenseForm() {
  const formRef    = useRef<HTMLFormElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast(2000);

  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [amount,  setAmount]  = useState("");
  const [method,  setMethod]  = useState<Method | null>(null);
  const [memo,    setMemo]    = useState("");

  const [state, formAction, isPending] = useActionState<ExpenseState, FormData>(
    registerExpense,
    null
  );

  const dateYYYYMMDD = isoToYYYYMMDD(selectedDate);
  const displayDate  = isoToDisplay(selectedDate);
  const isValid      = !!amount && !!method;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    const num = raw ? parseInt(raw) : "";
    setAmount(num === "" ? "" : num.toLocaleString("ko-KR"));
  };

  useEffect(() => {
    if (state?.status === 200) {
      setAmount("");
      setMethod(null);
      setMemo("");
      toast.show("등록되었습니다");
    }
  }, [state, toast.show]);

  return (
    <>
      <form ref={formRef} action={formAction} className="sr-only" aria-hidden>
        <input name="date"   value={dateYYYYMMDD} readOnly />
        <input name="amount" value={amount}       readOnly />
        <input name="method" value={method ?? ""} readOnly />
        <textarea name="memo" value={memo}        readOnly />
      </form>

      <div className="min-h-screen bg-slate-50 pb-24">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10">
          <p className="font-bold text-slate-800 text-lg">지출 등록</p>
          <Link
            href="/master/expense/list"
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-point transition-colors"
          >
            리스트
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mx-4 mt-5 flex flex-col gap-4">
          {/* 날짜 */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100">
            <label className="text-xs text-slate-400 block mb-1.5">날짜</label>
            <div
              className="relative cursor-pointer"
              onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
            >
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                {displayDate}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </p>
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                max={todayISO()}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                tabIndex={-1}
              />
            </div>
          </div>

          {/* 금액 */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100">
            <label className="text-xs text-slate-400 block mb-1.5">금액</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-slate-800 text-xl font-semibold focus:outline-none focus:border-blue-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">원</span>
            </div>
          </div>

          {/* 결제 방법 */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100">
            <label className="text-xs text-slate-400 block mb-2">방법</label>
            <div className="flex gap-2">
              {METHODS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMethod(method === value ? null : value)}
                  className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-colors ${
                    method === value
                      ? "bg-point text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 메모 */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100">
            <label className="text-xs text-slate-400 block mb-2">메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 text-sm resize-none focus:outline-none focus:border-blue-400 leading-relaxed"
            />
          </div>

          {/* 에러 */}
          {state && state.status !== 200 && (
            <p className="text-center text-sm text-error">{state.message}</p>
          )}

          {/* 등록 버튼 */}
          <button
            type="button"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={!isValid || isPending}
            className={`w-full h-14 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2 ${
              isValid && !isPending
                ? "bg-point text-white shadow-lg active:scale-95"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            {isPending ? <><Spinner size={20} />저장 중...</> : "등록하기"}
          </button>
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
