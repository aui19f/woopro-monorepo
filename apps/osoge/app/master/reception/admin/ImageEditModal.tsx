"use client";

import "react-easy-crop/react-easy-crop.css";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { getCroppedBlob } from "./cropUtils";

interface Props {
  imageSrc: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

const CONTROLS_H = 196;

export default function ImageEditModal({ imageSrc, onConfirm, onCancel }: Props) {
  const [crop, setCrop]               = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom]               = useState(1);
  const [rotation, setRotation]       = useState(0);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [processing, setProcessing]   = useState(false);

  // 브라우저 뒤로가기 가로채기
  useEffect(() => {
    history.pushState({ imageEdit: true }, "");
    const onPop = (e: PopStateEvent) => {
      if (e.state?.imageEdit) return;
      history.pushState({ imageEdit: true }, "");
      onCancel();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // 뒤로가기 없이 닫힐 때 pushState 제거
      if (history.state?.imageEdit) history.back();
    };
  }, [onCancel]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedArea) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea, rotation);
      onConfirm(blob);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-200 bg-black">
      {/* 크로퍼 컨테이너: absolute로 남은 공간 채움 */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ bottom: CONTROLS_H }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
          }}
        />
      </div>

      {/* 컨트롤 */}
      <div
        className="absolute inset-x-0 bottom-0 bg-neutral-900 px-5 pt-4 flex flex-col gap-3"
        style={{ height: CONTROLS_H, paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        {/* 회전 */}
        <div className="flex items-center gap-3">
          <span className="text-white text-xs w-8 shrink-0">회전</span>
          <input
            type="range" min={-180} max={180} value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="flex-1 accent-indigo-400"
          />
          <span className="text-white text-xs w-10 text-right">{rotation}°</span>
          <button type="button" onClick={() => setRotation(0)}
            className="text-xs text-slate-400 hover:text-white shrink-0">
            초기화
          </button>
        </div>

        {/* 줌 */}
        <div className="flex items-center gap-3">
          <span className="text-white text-xs w-8 shrink-0">줌</span>
          <input
            type="range" min={1} max={3} step={0.05} value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-indigo-400"
          />
          <span className="text-white text-xs w-10 text-right">{zoom.toFixed(1)}×</span>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className="flex-1 h-10 rounded-xl bg-slate-700 text-white text-sm font-medium">
            취소
          </button>
          <button type="button" onClick={() => onConfirm(new Blob())}
            className="h-10 px-3 rounded-xl bg-slate-600 text-slate-300 text-xs font-medium">
            편집 없이
          </button>
          <button type="button" onClick={handleConfirm} disabled={processing}
            className="flex-1 h-10 rounded-xl bg-indigo-600 text-white text-sm font-bold disabled:opacity-50">
            {processing ? "처리 중..." : "적용"}
          </button>
        </div>
      </div>
    </div>
  );
}
