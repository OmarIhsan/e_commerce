"use client";
import { useState } from "react";

export default function SizeSelector({ options = [], onChange }: { options?: string[]; onChange?: (size: string) => void }) {
  const opts = options.length ? options : ["XS", "S", "M", "L", "XL"];
  const [size, setSize] = useState(opts[0]);
  return (
    <div className="mt-4">
      <h2 className="font-semibold">Size</h2>
      <div className="flex gap-2 mt-2">
        {opts.map(opt => (
          <button key={opt} className={`px-3 py-1 rounded-subtle border ${size === opt ? 'border-indigo' : 'border-mist'}`} onClick={() => { setSize(opt); onChange?.(opt); }} aria-pressed={size === opt}>{opt}</button>
        ))}
      </div>
    </div>
  );
}
