import React from "react";
import type { ImageProps } from "next/image";

// 1. ImageProps에서 src의 타입을 직접 추출합니다.
// 이렇게 하면 Next.js 버전에 상관없이 항상 정확한 타입을 참조합니다.
type NextImageSrc = ImageProps["src"];

export default function NextImageMock({ unoptimized, ...props }: ImageProps) {
  // 2. 타입을 안전하게 분리하는 헬퍼 함수
  const getSrc = (src: NextImageSrc): string => {
    // 문자열인 경우 바로 반환
    if (typeof src === "string") return src;

    // StaticImport 구조 내에서 실제 URL 문자열을 추출
    // 'default'가 있는 StaticRequire인지, 아니면 StaticImageData인지 체크
    if (src && typeof src === "object") {
      if ("default" in src) {
        return src.default.src;
      }
      if ("src" in src) {
        return src.src;
      }
    }

    return "";
  };

  return (
    <img
      {...props}
      src={getSrc(props.src)}
      style={{
        maxWidth: "100%",
        height: "auto",
        ...props.style,
      }}
      // 스토리북 환경용 데이터 속성
      data-unoptimized={unoptimized ?? true}
    />
  );
}
