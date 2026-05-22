"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPhone } from "@repo/schemas/formatters";
import { phoneRegex } from "@repo/schemas/regex";
import { adminRegisterReception, type ReceptionState } from "../actions";

const INITIAL_DIGITS = "010";

const KEYPAD_ROWS = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["clear", "0", "delete"],
] as const;

type Key = (typeof KEYPAD_ROWS)[number][number];
type PaymentTiming = "PREPAID" | "POSTPAID";

interface Props {
  todayCount: number;
  today: string;
}

function maskPhone(formatted: string): string {
  const parts = formatted.split("-");
  return `010-****-${parts[2] ?? ""}`;
}

export default function AdminReception({ todayCount, today }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [digits, setDigits] = useState(INITIAL_DIGITS);
  const [quantity, setQuantity] = useState("1");
  const [amount, setAmount] = useState("");
  const [paymentTiming, setPaymentTiming] = useState<PaymentTiming | null>(null);
  const [hideMiddle, setHideMiddle] = useState(false);
  const [count, setCount] = useState(todayCount);

  const [state, formAction, isPending] = useActionState<ReceptionState, FormData>(
    adminRegisterReception,
    null
  );

  const formatted = formatPhone(digits);
  const isValid = phoneRegex.test(formatted);
  const storedPhone = hideMiddle && isValid ? maskPhone(formatted) : formatted;

  const handleKey = (key: Key) => {
    if (key === "clear") {
      setDigits(INITIAL_DIGITS);
    } else if (key === "delete") {
      setDigits((d) => (d.length > INITIAL_DIGITS.length ? d.slice(0, -1) : d));
    } else if (digits.length < 11) {
      setDigits((d) => d + key);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    const num = raw ? parseInt(raw) : "";
    setAmount(num === "" ? "" : num.toLocaleString("ko-KR"));
  };

  const handleSubmit = () => {
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (state?.status === 200) {
      setCount((c) => c + 1);
      setDigits(INITIAL_DIGITS);
      setQuantity("1");
      setAmount("");
      setPaymentTiming(null);
      router.refresh();
    }
  }, [state, router]);

  return (
    <>
      {/* 서버 액션 hidden form */}
      <form ref={formRef} action={formAction} className="sr-only" aria-hidden>
        <input name="phone" value={storedPhone} readOnly />
        <input name="quantity" value={quantity} readOnly />
        <input name="amount" value={amount} readOnly />
        <input name="paymentTiming" value={paymentTiming ?? ""} readOnly />
      </form>

      <div className="h-screen overflow-hidden flex flex-col bg-slate-50 select-none">

        {/* 헤더: 날짜 + 접수 수량 */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-medium">관리자 접수 모드</p>
            <p className="text-base font-semibold text-slate-700 mt-0.5">{today}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">오늘 접수</p>
            <p className="text-2xl font-bold text-point">
              {count}
              <span className="text-sm font-normal text-slate-400 ml-1">건</span>
            </p>
          </div>
        </div>

        {/* 전화번호 표시 */}
        <div className="px-5 py-4 bg-white mt-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400">입력된 번호</p>
            {/* 뒷자리만 저장 체크박스 */}
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hideMiddle}
                onChange={(e) => setHideMiddle(e.target.checked)}
                className="w-4 h-4 accent-point"
              />
              <span className="text-xs text-slate-500">뒷자리만 저장</span>
            </label>
          </div>
          <p className={`text-4xl font-bold tracking-widest ${isValid ? "text-slate-800" : "text-slate-300"}`}>
            {isValid ? storedPhone : (formatted || "010-0000-0000")}
          </p>
        </div>

        {/* 키패드 */}
        <div className="flex justify-center mt-3">
          <div className="flex flex-col gap-2">
            {KEYPAD_ROWS.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((key) => {
                  const isSpecial = key === "clear" || key === "delete";
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleKey(key)}
                      className={`
                        w-[72px] h-[72px] rounded-xl font-semibold
                        shadow-sm active:scale-95 transition-transform duration-75
                        ${isSpecial
                          ? "bg-slate-200 text-slate-500 text-sm"
                          : "bg-white border border-slate-200 text-slate-800 text-2xl"
                        }
                      `}
                    >
                      {key === "clear" ? "초기화" : key === "delete" ? "⌫" : key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 입력 폼: 수량 / 금액 / 지불 방법 */}
        <div className="mx-4 mt-4 bg-white rounded-2xl px-5 py-4 flex flex-col gap-3 border border-slate-100">
          <div className="flex items-center gap-3">
            <label className="w-14 text-sm font-medium text-slate-500 shrink-0">수량</label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-800 text-base font-semibold focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="w-14 text-sm font-medium text-slate-500 shrink-0">금액</label>
            <div className="flex-1 relative">
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 pr-8 text-slate-800 text-base font-semibold focus:outline-none focus:border-blue-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">원</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-14 text-sm font-medium text-slate-500 shrink-0">지불</label>
            <div className="flex gap-2 flex-1">
              {(["PREPAID", "POSTPAID"] as PaymentTiming[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPaymentTiming((prev) => (prev === t ? null : t))}
                  className={`
                    flex-1 h-10 rounded-lg text-sm font-semibold transition-colors
                    ${paymentTiming === t
                      ? "bg-point text-white"
                      : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {t === "PREPAID" ? "선불" : "후불"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {state && state.status !== 200 && (
          <p className="text-center text-sm text-error mt-2">{state.message}</p>
        )}

        {/* 등록 버튼 */}
        <div className="mx-4 mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className={`
              w-full h-14 rounded-2xl text-lg font-bold transition-all duration-150
              ${isValid && !isPending
                ? "bg-point text-white shadow-lg active:scale-95"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }
            `}
          >
            {isPending ? "저장 중..." : "등록하기"}
          </button>
        </div>
      </div>
    </>
  );
}
