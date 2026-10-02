"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const activeImage = images[selectedIndex] || { url: "/placeholder.png" };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[500px] shrink-0 scrollbar-none py-1">
        {images.map((img, idx) => (
          <button
            key={img.id || idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
              selectedIndex === idx
                ? "border-indigo-600 ring-2 ring-indigo-100"
                : "border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
            }`}
          >
            <Image
              src={img.url}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Display with Hover Zoom */}
      <div
        className="relative flex-1 aspect-square rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden cursor-crosshair group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage.url}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover object-center transition-transform duration-200 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : undefined
          }
        />
        <div className="absolute bottom-3 right-3 bg-slate-900/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Hover to zoom
        </div>
      </div>
    </div>
  );
}
