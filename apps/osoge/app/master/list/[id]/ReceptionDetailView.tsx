"use client";

import { useState, useTransition } from "react";
import Input from "@repo/ui/components/forms/input/Input";
import Checkbox from "@repo/ui/components/forms/Checkbox/Checkbox";
import { saveDetail, sendAndSaveDetail } from "@/app/master/@modal/(.)list/[id]/actions";

type Status = "READY" | "IN_PROGRESS" | "DONE" | "CANCELLED";
type PaymentTiming = "PREPAID" | "POSTPAID";
type PaymentMethod = "CARD" | "CASH" | "TRANSFER" | "GIFT_VOUCHER" | "OTHER";

export type ReceptionDetail = {
  id: string;
  phone: string | null;
  name: string | null;
  date: string;
  time: string;
  status: Status;
  message_sent_count: number;
  payment_amount: number | null;
  payment_timing: PaymentTiming | null;
  payment_method: PaymentMethod | null;
  quantity: number;
  memo: string | null;
};

const STATUS_TABS: { value: Status; label: string; active: string }[] = [
  { value: "READY",       label: "준비", active: "bg-blue-100 text-blue-600 border-blue-300" },
  { value: "IN_PROGRESS", label: "진행", active: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "DONE",        label: "완료", active: "bg-green-100 text-green-700 border-green-300" },
  { value: "CANCELLED",   label: "취소", active: "bg-red-100 text-red-600 border-red-300" },
];

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CARD: "카드",
  CASH: "현금",
  TRANSFER: "계좌",
  GIFT_VOUCHER: "상품권",
  OTHER: "기타",
};

function formatDate(d: string) {
  if (d.length !== 8) return d;
  return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`;
}

function toInputDate(d: string) {
  if (d.length !== 8) return "";
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
}

function fromInputDate(d: string) {
  return d.replace(/-/g, "");
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

function calcDaysElapsed(dateStr: string) {
  const y = parseInt(dateStr.slice(0, 4), 10);
  const m = parseInt(dateStr.slice(4, 6), 10) - 1;
  const d = parseInt(dateStr.slice(6, 8), 10);
  const reception = new Date(y, m, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  reception.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - reception.getTime()) / 86400000);
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      {children}
    </div>
  );
}

export default function ReceptionDetailView({
  reception,
  onClose,
  onSaved,
  mode,
}: {
  reception: ReceptionDetail;
  onClose: () => void;
  onSaved?: () => void;
  mode: "modal" | "page";
}) {
  const [isPending, startTransition] = useTransition();

  const [date, setDate] = useState(reception.date);
  const [status, setStatus] = useState<Status>(reception.status);
  const [paymentTiming, setPaymentTiming] = useState<PaymentTiming | null>(reception.payment_timing);
  const [paymentAmount, setPaymentAmount] = useState(reception.payment_amount?.toString() ?? "");
  const [sendMessage, setSendMessage] = useState(false);
  const [memo, setMemo] = useState(reception.memo ?? "");

  const displayAmount = paymentAmount
    ? Number(paymentAmount).toLocaleString("ko-KR")
    : "";

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPaymentAmount(e.target.value.replace(/[^0-9]/g, ""));
  }

  const daysElapsed = calcDaysElapsed(reception.date);
  const hasPayment = reception.payment_amount !== null;

  function buildData() {
    return {
      date,
      status,
      paymentTiming,
      paymentMethod: reception.payment_method,
      paymentAmount: paymentAmount ? parseInt(paymentAmount, 10) : null,
      memo,
    };
  }

  const afterSave = onSaved ?? onClose;

  function handleSave() {
    startTransition(async () => {
      await saveDetail(reception.id, buildData());
      afterSave();
    });
  }

  function handleSendAndSave() {
    startTransition(async () => {
      await sendAndSaveDetail(reception.id, buildData());
      afterSave();
    });
  }

  return (
    <>
      {/* 헤더 */}
      <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        {mode === "page" ? (
          <div>
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-1"
            >
              ← 목록으로
            </button>
            <p className="text-xs text-slate-400">접수번호</p>
            <h2 className="text-lg font-bold tracking-wide text-slate-800 font-mono">
              {reception.id}
            </h2>
          </div>
        ) : (
          <>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">접수번호</p>
              <h2 className="text-lg font-bold tracking-wide text-slate-800 font-mono">
                {reception.id}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors mt-1"
            >
              ✕
            </button>
          </>
        )}
      </div>

      {/* 바디 */}
      <div className="px-6 py-5 space-y-6 flex-1 overflow-y-auto">
        {/* 기본 정보 */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm items-center">
          <span className="text-slate-500 flex items-center gap-1.5">
            접수일
            <span className="relative">
              <span className="text-slate-800 font-medium">{formatDate(date)}</span>
              <input
                type="date"
                value={toInputDate(date)}
                onChange={(e) => e.target.value && setDate(fromInputDate(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </span>
          <span className="text-slate-500">
            접수시간{" "}
            <span className="text-slate-800 font-medium">{formatTime(reception.time)}</span>
          </span>
          <span className="font-semibold text-point">D+{daysElapsed}일</span>
        </div>

        <div className="text-sm flex items-center gap-3">
          {reception.phone ? (
            <>
              <span className="text-slate-400">연락처</span>
              <span className="text-slate-800 font-medium">{reception.phone}</span>
            </>
          ) : (
            <>
              <span className="text-slate-400">이름</span>
              <span className="text-slate-800 font-medium">{reception.name ?? "-"}</span>
            </>
          )}
        </div>

        {/* 상태 */}
        <Section label="상태">
          <div className="flex gap-2">
            {STATUS_TABS.map(({ value, label, active }) => (
              <button
                key={value}
                onClick={() => setStatus(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  status === value
                    ? active
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* 내역 */}
        <Section label="내역">
          {hasPayment ? (
            <p className="text-sm text-slate-800">
              {reception.payment_amount!.toLocaleString()}원
              {reception.payment_method &&
                ` · ${PAYMENT_METHOD_LABEL[reception.payment_method]}`}
              {` · ${reception.quantity}건`}
            </p>
          ) : (
            <p className="text-sm text-slate-400">-</p>
          )}
        </Section>

        {/* 지불방법 */}
        <Section label="지불방법">
          <div className="flex gap-2">
            {(
              [
                ["PREPAID", "선불"],
                ["POSTPAID", "후불"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setPaymentTiming(paymentTiming === value ? null : value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  paymentTiming === value
                    ? "bg-point/10 text-point border-point/30"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* 총액 */}
        <Section label="총액">
          <div className="flex items-center gap-2">
            <div className="w-40">
              <Input
                name="payment_amount"
                type="text"
                inputMode="numeric"
                sizing="sm"
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="0"
                className="text-right"
              />
            </div>
            <span className="text-sm text-slate-500">원</span>
          </div>
        </Section>

        {/* 완료메시지 */}
        <div className="flex items-center gap-3">
          <Checkbox
            sizing="sm"
            options={[{ id: "send", label: "완료메시지 전송" }]}
            selected={sendMessage ? ["send"] : []}
            onChange={() => setSendMessage((prev) => !prev)}
          />
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {reception.message_sent_count > 0 ? `${reception.message_sent_count}번전송` : "미전송"}
          </span>
        </div>

        {/* 메모 */}
        <Section label="메모">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            placeholder="메모를 입력하세요"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 resize-none"
          />
        </Section>
      </div>

      {/* 푸터 */}
      <div className="flex items-center justify-between px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-slate-100 shrink-0 bg-white">
        <button
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-40"
        >
          취소
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSendAndSave}
            disabled={isPending}
            className="px-5 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            전송&저장
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-5 py-2 text-sm font-medium bg-point text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </>
  );
}
