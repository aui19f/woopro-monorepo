"use client";

import Image from "next/image";
import { ChangeEvent, useId, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { FormGeometry, imageGeometries } from "@/types/forms";

interface ImageUploaderProps {
  previews: string[];
  onImageChange: (files: FileList) => void;
  onRemove: (index: number) => void;
  sizing?: FormGeometry; // sizing 추가
  maxCount?: number;
  className?: string;
}

export default function ImageUploader({
  previews = [],
  onImageChange,
  onRemove,
  sizing = "md",
  maxCount = 5,
  className,
}: ImageUploaderProps) {
  const generatedId = useId(); // 컴포넌트 인스턴스마다 고유한 ID 생성
  const inputId = `image-upload-${generatedId}`;

  const inputRef = useRef<HTMLInputElement>(null);
  const styles = imageGeometries[sizing];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageChange(e.target.files);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={twMerge("flex flex-wrap gap-3", className)}>
      {/* 1. 이미지 미리보기 리스트 */}
      {previews.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={twMerge("relative flex-shrink-0 group", styles.box)}
        >
          <Image
            src={src}
            alt={`미리보기 ${i + 1}`}
            fill
            className="object-cover rounded-xl border border-slate-200"
          />
          {/* 삭제 버튼: 사이즈에 따른 크기 조절 */}
          <button
            type="button"
            onClick={() => onRemove(i)}
            className={twMerge(
              "absolute -top-1.5 -right-1.5 flex items-center justify-center text-white transition-all bg-slate-800 rounded-full shadow-lg hover:bg-red-500 active:scale-90",
              styles.removeBtn
            )}
            aria-label="이미지 삭제"
          >
            <svg
              className="w-1/2 h-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}

      {/* 2. 업로드 버튼 */}
      {previews.length < maxCount && (
        <label
          className={twMerge(
            "flex flex-col items-center justify-center transition-all border-2 border-dashed rounded-xl cursor-pointer hover:bg-blue-50",
            styles.box,
            "border-slate-300 hover:border-point text-slate-400 hover:text-point"
          )}
        >
          <input
            id={inputId}
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            aria-label="이미지 업로드"
          />
          <svg
            className={twMerge("mb-1", styles.icon)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <div className={twMerge("flex font-medium", styles.textSize)}>
            <span className={previews.length > 0 ? "text-point" : ""}>
              {previews.length}
            </span>
            <span>/{maxCount}</span>
          </div>
        </label>
      )}
    </div>
  );
}
