"use client";

import { FormOption, selectionGeometries, FormGeometry } from "@/types/forms";
import React, { useId } from "react";
import { twMerge } from "tailwind-merge";

interface RadioProps {
  sizing?: FormGeometry;
  options: FormOption[];
  selected: string; // 라디오는 단일 값이므로 string
  onChange: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
  children?: React.ReactNode;
}

export default function Radio({
  options,
  selected,
  onChange,
  ref,
  className,
  children,
  sizing = "md",
}: RadioProps) {
  const baseId = useId();
  const sizeStyle = selectionGeometries[sizing];

  // 클릭 시 현재 값과 같으면 해제(deselect), 다르면 선택
  const handleToggle = (value: string) => {
    if (selected === value) {
      onChange("");
    } else {
      onChange(value);
    }
  };

  return (
    <div className={twMerge("flex flex-col", sizeStyle.gap, className)}>
      {options.map((option) => {
        const uniqueId = `${baseId}-${option.id}`;
        const isSelected = selected === option.id;

        return (
          <React.Fragment key={option.id}>
            <div className="flex items-center gap-3">
              <label
                htmlFor={uniqueId}
                className="relative flex items-center gap-2 cursor-pointer group"
              >
                {/* 1. 라디오 본체 (rounded-full 적용) */}
                <div
                  className={twMerge(
                    "relative flex items-center justify-center border rounded-full transition-all",
                    sizeStyle.box,
                    isSelected
                      ? "border-point bg-white"
                      : "border-slate-300 bg-white"
                  )}
                >
                  <input
                    id={uniqueId}
                    type="radio"
                    ref={ref}
                    name={baseId} // 그룹화를 위해 동일한 name 부여
                    value={option.id}
                    checked={isSelected}
                    // 표준 라디오는 선택 해제가 안 되므로 onClick으로 로직 가로채기
                    onClick={() => handleToggle(option.id)}
                    onChange={() => {}} // React 경고 방지
                    className="absolute inset-0 opacity-0 cursor-pointer peer"
                  />

                  {/* 2. 내부 점(Dot) - indicator 사이즈 적용 */}
                  <div
                    className={twMerge(
                      "rounded-full bg-point transition-transform scale-0 pointer-events-none peer-checked:scale-100",
                      sizeStyle.indicator
                    )}
                  />
                </div>

                {/* 3. 텍스트 사이즈 적용 */}
                <span
                  className={twMerge(
                    "transition-colors text-slate-700",
                    sizeStyle.text,
                    isSelected && "text-point font-medium"
                  )}
                >
                  {option.label}
                </span>
              </label>

              {/* 선택된 옵션 옆에 추가 Input 등을 띄울 때 사용 */}
              {isSelected && children && (
                <div className="flex-1 animate-in fade-in slide-in-from-left-1">
                  {children}
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
