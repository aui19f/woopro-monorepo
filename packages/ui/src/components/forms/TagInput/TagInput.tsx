"use client";
import { useState, KeyboardEvent, useRef } from "react";
import { formGeometries, FormGeometry } from "@/types/forms";
import { twMerge } from "tailwind-merge";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  sizing?: FormGeometry;
  placeholder?: string;
  className?: string; // 외부 레이아웃 조절용 추가
}

export default function TagInput({
  tags,
  onTagsChange,
  sizing = "md",
  placeholder,
  className,
}: TagInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const sizeStyle = formGeometries[sizing];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 1. 태그 추가 로직 (Enter)
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue("");
      return;
    }

    // 2. 태그 삭제 로직 (Backspace)
    // 입력창이 비어있을 때 Backspace를 누르면 마지막 태그 삭제
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onTagsChange(tags.slice(0, -1)); // 마지막 요소 제외하고 복사
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={twMerge(
        "flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-sm px-2 py-1 transition-all focus-within:border-blue-400 cursor-text",
        sizeStyle,
        "h-auto min-h-[40px]",
        className
      )}
    >
      {/* 태그 리스트: div로 감싸는 대신 바로 나열하여 flex-wrap의 이점 활용 */}
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`} // index만 쓰기보다 값과 조합하여 고유성 강화
          className="flex items-center gap-1 bg-accent text-slate-700 px-2 py-0.5 rounded-sm text-xs font-medium animate-in zoom-in-95 duration-200"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // 부모 div의 focus 이벤트 전파 방지
              removeTag(i);
            }}
            className="hover:text-error transition-colors font-bold ml-1"
          >
            ×
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-inherit min-w-[80px]"
      />
    </div>
  );
}
