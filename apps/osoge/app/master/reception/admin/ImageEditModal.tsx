"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { getCroppedBlob } from "./cropUtils";

interface Props {
  imageSrc: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

export default function ImageEditModal({ imageSrc, onConfirm, onCancel }: Props) {
  const [crop, setCrop]         = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom]         = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [processing, setProcessing]   = useState(false);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
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
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* 크로퍼 영역 */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={undefined}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* 컨트롤 */}
      <div className="bg-black/90 px-5 pt-4 pb-8 flex flex-col gap-4">
        {/* 회전 */}
        <div className="flex items-center gap-3">
          <span className="text-white text-xs w-8 shrink-0">회전</span>
          <input
            type="range"
            min={-180}
            max={180}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <span className="text-white text-xs w-10 text-right">{rotation}°</span>
          <button
            type="button"
            onClick={() => setRotation(0)}
            className="text-xs text-slate-400 hover:text-white"
          >
            초기화
          </button>
        </div>

        {/* 줌 */}
        <div className="flex items-center gap-3">
          <span className="text-white text-xs w-8 shrink-0">줌</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <span className="text-white text-xs w-10 text-right">{zoom.toFixed(1)}×</span>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl bg-slate-700 text-white text-sm font-medium"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onConfirm(new Blob())}
            className="h-11 px-4 rounded-xl bg-slate-600 text-slate-300 text-sm font-medium"
          >
            편집 없이 추가
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing}
            className="flex-1 h-11 rounded-xl bg-indigo-600 text-white text-sm font-bold disabled:opacity-50"
          >
            {processing ? "처리 중..." : "적용"}
          </button>
        </div>
      </div>
    </div>
  );
}
