"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPhone } from "@repo/schemas/formatters";
import { phoneRegex } from "@repo/schemas/regex";
import Spinner from "@repo/ui/components/Spinner/Spinner";
import Toast from "@repo/ui/components/Toast/Toast";
import { useToast } from "@repo/ui/hooks/useToast";
import { adminRegisterReception, getCountByDate, type ReceptionState } from "../actions";

interface Props {
  todayCount: number;
  todayISO: string;
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

export default function AdminReception({ todayCount, todayISO }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast(2000);

  const [phoneDigits, setPhoneDigits] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isPostpaid, setIsPostpaid] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [count, setCount] = useState(todayCount);

  const [state, formAction, isPending] = useActionState<ReceptionState, FormData>(
    adminRegisterReception,
    null
  );

  const phoneFormatted = formatPhone(phoneDigits);
  const isPhoneEntered = phoneRegex.test(phoneFormatted);
  const isValid = isPhoneEntered || name.trim().length > 0;
  const dateYYYYMMDD = isoToYYYYMMDD(selectedDate);
  const displayDate = isoToDisplay(selectedDate);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhoneDigits(digits);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    const num = raw ? parseInt(raw) : "";
    setAmount(num === "" ? "" : num.toLocaleString("ko-KR"));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setSelectedDate(e.target.value);
  };

  const handleSubmit = () => {
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    getCountByDate(dateYYYYMMDD).then(setCount);
  }, [dateYYYYMMDD]);

  useEffect(() => {
    if (state?.status === 200) {
      setCount((c) => c + 1);
      setPhoneDigits("");
      setName("");
      setAmount("");
      setMemo("");
      setIsPostpaid(false);
      toast.show("완료되었습니다");
      router.refresh();
    }
  }, [state, router, toast.show]);

  return (
    <>
      {/* 서버 액션 hidden form */}
      <form ref={formRef} action={formAction} className="sr-only" aria-hidden>
        <input name="phone" value={isPhoneEntered ? phoneFormatted : ""} readOnly />
        <input name="name" value={name} readOnly />
        <input name="date" value={dateYYYYMMDD} readOnly />
        <input name="amount" value={amount} readOnly />
        <input name="paymentTiming" value={isPostpaid ? "POSTPAID" : "PREPAID"} readOnly />
        <textarea name="memo" value={memo} readOnly />
      </form>

      <div className="min-h-screen bg-slate-50 pb-10">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10">
          <div>
            <p className="text-xs text-slate-400 font-medium">관리자 접수 모드</p>
            <div
              className="relative mt-0.5 cursor-pointer"
              onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
            >
              <p className="font-semibold text-slate-700 flex items-center gap-1.5 pr-1">
                {displayDate}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </p>
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                tabIndex={-1}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">접수</p>
            <p className="text-2xl font-bold text-point">
              {count}
              <span className="text-sm font-normal text-slate-400 ml-1">건</span>
            </p>
          </div>
        </div>

        {/* 폼 */}
        <div className="mx-4 mt-5 flex flex-col gap-4">

          {/* 이름 */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100">
            <label className="text-xs text-slate-400 block mb-1.5">
              이름 <span className="text-slate-300">(전화번호 없을 시 필수)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="고객 이름"
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 text-lg font-semibold focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* 전화번호 */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100">
            <label className="text-xs text-slate-400 block mb-1.5">
              전화번호 <span className="text-slate-300">(이름 없을 시 필수)</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              value={phoneDigits ? phoneFormatted : ""}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              className={`w-full h-11 rounded-xl border bg-slate-50 px-4 text-lg font-semibold tracking-widest focus:outline-none focus:border-blue-400 ${
                isPhoneEntered ? "border-slate-200 text-slate-800" : "border-slate-200 text-slate-400"
              }`}
            />
          </div>

          {/* 금액 + 후불 */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <label className="w-14 text-sm font-medium text-slate-500 shrink-0">금액</label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 pr-8 text-slate-800 font-semibold focus:outline-none focus:border-blue-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">원</span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isPostpaid}
                  onChange={(e) => setIsPostpaid(e.target.checked)}
                  className="w-4 h-4 accent-point"
                />
                <span className="text-sm text-slate-500">후불</span>
              </label>
            </div>
          </div>

          {/* 메모 */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100">
            <label className="text-xs text-slate-400 block mb-2">메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="특이사항, 요청사항 등"
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
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className={`
              w-full h-14 rounded-2xl text-lg font-bold transition-all duration-150 flex items-center justify-center gap-2
              ${isValid && !isPending
                ? "bg-point text-white shadow-lg active:scale-95"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }
            `}
          >
            {isPending ? (
              <>
                <Spinner size={20} />
                저장 중...
              </>
            ) : (
              "등록하기"
            )}
          </button>
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
