"use client";

interface SizeSelectorProps {
  options?: string[];
  selected?: string;
  onChange: (size: string) => void;
  label?: string;
}

export default function SizeSelector({
  options = [],
  selected,
  onChange,
  label = "Select Option",
}: SizeSelectorProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-titanium-300 font-medium">{label}</span>
        {selected && (
          <span className="text-blue-400 font-bold">
            {selected}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`px-3.5 py-2 rounded-lg text-xs transition-all border font-medium ${
                isSelected
                  ? "bg-blue-600/20 border-blue-500 text-blue-400 font-bold"
                  : "bg-titanium-900 border-white/10 text-titanium-300 hover:text-white hover:border-white/30"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
