"use client";
import { useState } from "react";

export default function ProductGallery({ images = [] }: { images?: string[] }) {
  const [active, setActive] = useState(0);
  const thumbs = images.length ? images : ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg"];
  return (
    <div>
      <div className="rounded-subtle bg-mist h-64 mb-3" aria-label="Product media" />
      <ul className="flex gap-2" aria-label="Gallery thumbnails">
        {thumbs.map((_, i) => (
          <li key={i}>
            <button aria-label={`Show image ${i + 1}`} onClick={() => setActive(i)} className={`w-16 h-16 rounded-subtle ${active === i ? 'ring-2 ring-indigo' : 'border border-mist'}`}></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
