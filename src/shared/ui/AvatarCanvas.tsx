"use client";
import * as React from "react";
import { getAvatarWasm } from "../lib/wasm/avatarWasm";

export default function AvatarCanvas({
  src,
  size = 40,
  ringColor = "#0f4e8a",
}: {
  src: string;
  size?: number;
  ringColor?: string;
}) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoaded(false);

    (async () => {
      const canvas = ref.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `/api/avatar?url=${encodeURIComponent(src)}`;
      await img.decode();
      if (cancelled) return;

      // draw + crop
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();

      // wasm tint
      const imageData = ctx.getImageData(0, 0, size, size);
      const len = imageData.data.length;
      const wasm = await getAvatarWasm();

      if (wasm.memory.buffer.byteLength < len) {
        wasm.memory.grow(
          Math.ceil((len - wasm.memory.buffer.byteLength) / 65536)
        );
      }
      new Uint8Array(wasm.memory.buffer).set(imageData.data, 0);
      wasm.tint(0, len, 6, 0, 8);
      imageData.data.set(new Uint8Array(wasm.memory.buffer, 0, len));
      ctx.putImageData(imageData, 0, 0);

      // ring
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [src, size, ringColor]);

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9999,
            background: "rgba(0,0,0,0.2)",
            animation: "pulse 1.2s ease-in-out infinite",
          }}
        />
      )}
      <canvas
        ref={ref}
        width={size}
        height={size}
        style={{
          display: "block",
          width: `${size}px`,
          height: `${size}px`,
          position: "relative",
        }}
      />
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
