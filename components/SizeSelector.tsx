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
  label = "Select Variant / Size",
}: SizeSelectorProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-titanium-300 uppercase tracking-wider">{label}</span>
        {selected && (
          <span className="text-cyber-cyan font-bold">
            SELECTED: {selected}
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
              className={`px-3.5 py-2 rounded-subtle font-mono text-xs transition-all border ${
                isSelected
                  ? "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold shadow-glow"
                  : "bg-titanium-900/60 border-white/10 text-titanium-300 hover:text-white hover:border-white/30"
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
