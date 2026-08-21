"use client";

import { useState, useRef, MouseEvent } from "react";
import { ZoomIn, Sparkles } from "lucide-react";

interface ProductGalleryProps {
  images?: string[];
  productName?: string;
}

export default function ProductGallery({ images = [], productName = "Product" }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const displayImages = images.length > 0 ? images : ["/placeholder-1.jpg"];
  const currentImage = displayImages[activeIdx] || displayImages[0];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container with Magnifier */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        className="relative h-[440px] md:h-[500px] w-full rounded-card overflow-hidden glass-panel border border-white/10 bg-titanium-950 cursor-crosshair group shadow-2xl"
      >
        <img
          src={currentImage}
          alt={`${productName} view ${activeIdx + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isZoomed ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* High-Precision Zoom Overlay (2.5x magnification) */}
        {isZoomed && (
          <div
            className="absolute inset-0 pointer-events-none bg-no-repeat"
            style={{
              backgroundImage: `url(${currentImage})`,
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundSize: "260%",
            }}
          />
        )}

        {/* Zoom Hint Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-subtle bg-titanium-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-titanium-300 pointer-events-none shadow-sm">
          <ZoomIn className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>{isZoomed ? "2.6X OPTICAL ZOOM ACTIVE" : "HOVER TO MAGNIFY"}</span>
        </div>

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-subtle bg-titanium-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyber-cyan pointer-events-none">
          <Sparkles className="w-3 h-3" />
          <span>HI-RES MATRIX INSPECTION</span>
        </div>
      </div>

      {/* Thumbnail Selector Strip */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {displayImages.map((src, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative w-20 h-20 rounded-soft overflow-hidden bg-titanium-900 border transition-all shrink-0 ${
                  isActive
                    ? "border-cyber-cyan ring-2 ring-cyber-cyan/40 scale-105 shadow-glow"
                    : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                }`}
                aria-label={`Switch to gallery image ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {isActive && (
                  <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-cyber-cyan" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
