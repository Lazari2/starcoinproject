import { Period } from "@/types/finance";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Period; label: string }[] = [
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
  { value: "year", label: "Ano" },
  { value: "all", label: "Tudo" },
];

interface Props {
  value: Period;
  onChange: (p: Period) => void;
}

export function PeriodToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card/60 p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
            value === opt.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
