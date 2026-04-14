"use client";

import { FormGeometry, formGeometries } from "@/types/forms";
import { twMerge } from "tailwind-merge";

// 6가지 케이스 대응을 위한 타입 정의
type PickerMode = "date" | "time" | "datetime";

interface DateTimePickerProps {
  mode: PickerMode;
  isRange?: boolean;
  value: string | { start: string; end: string };
  onChange: (value: any) => void; // 실제 구현시 Zod나 특정 타입으로 구체화
  sizing?: FormGeometry;
  className?: string;
  isError?: boolean;
}

export default function DateTimePicker({
  mode,
  isRange = false,
  value,
  onChange,
  sizing = "md",
  className,
  isError = false,
}: DateTimePickerProps) {
  const sizeStyle = formGeometries[sizing];

  // 내부 input type 결정
  const inputType = mode === "datetime" ? "datetime-local" : mode;

  // 단일 선택 렌더링
  if (!isRange) {
    return (
      <input
        type={inputType}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        className={twMerge(
          "w-full outline-none transition-all ",
          sizeStyle,
          isError && "border-error",
          className
        )}
      />
    );
  }

  // 범위 선택 렌더링 (날짜, 시간, 날짜시간 모두 대응)
  const rangeValue = typeof value === "object" ? value : { start: "", end: "" };

  return (
    <div className={twMerge("flex items-center gap-2 w-full", className)}>
      <input
        type={inputType}
        value={rangeValue.start}
        onChange={(e) => onChange({ ...rangeValue, start: e.target.value })}
        className={twMerge(
          "flex-1 outline-none transition-all ",
          sizeStyle,
          isError && "border-error"
        )}
      />
      <span className="text-slate-400 text-sm font-bold">~</span>
      <input
        type={inputType}
        value={rangeValue.end}
        onChange={(e) => onChange({ ...rangeValue, end: e.target.value })}
        className={twMerge(
          "flex-1 outline-none transition-all ",
          sizeStyle,
          isError && "border-error"
        )}
      />
    </div>
  );
}
