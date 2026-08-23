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
        <span className="text-slate-700 dark:text-titanium-300 font-medium">{label}</span>
        {selected && (
          <span className="text-blue-600 dark:text-blue-400 font-bold">
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
              className={`px-3.5 py-2 rounded-lg text-xs transition-all border font-medium cursor-pointer ${
                isSelected
                  ? "bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-xs"
                  : "bg-white dark:bg-titanium-900 border-slate-300 dark:border-white/10 text-slate-700 dark:text-titanium-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30"
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
