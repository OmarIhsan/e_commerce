"use client";
import { useState } from "react";

export default function ProductGallery({ images = [] }: { images?: string[] }) {
  const [active, setActive] = useState(0);
  const thumbs = images.length ? images : ["/placeholder-1.jpg"];
  return (
    <div className="space-y-3">
      <div className="card overflow-hidden rounded-soft h-80 flex items-center justify-center bg-mist">
        <img src={thumbs[active]} alt={`Product image ${active + 1}`} className="w-full h-full object-cover" />
      </div>
      <ul className="flex gap-3" aria-label="Gallery thumbnails">
        {thumbs.map((src, i) => (
          <li key={i}>
            <button aria-label={`Show image ${i + 1}`} onClick={() => setActive(i)} className={`w-20 h-20 rounded-subtle overflow-hidden border ${active === i ? 'ring-2 ring-brandB-500' : 'border-transparent'}`}>
              <img src={src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
