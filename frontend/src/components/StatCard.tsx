import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  label: string;
  value: number;
  icon: ReactNode;
  variant?: "default" | "income" | "expense" | "balance";
  trend?: number; // percentage
  hint?: string;
}

export function StatCard({ label, value, icon, variant = "default", trend, hint }: Props) {
  const variantClass = {
    default: "from-card to-card",
    income: "bg-gradient-income",
    expense: "bg-gradient-expense",
    balance: "from-primary/10 to-card",
  }[variant];

  const accentColor = {
    default: "text-foreground",
    income: "text-income",
    expense: "text-expense",
    balance: value >= 0 ? "text-income" : "text-expense",
  }[variant];

  return (
    <div className={cn("stat-card animate-fade-in relative overflow-hidden", variantClass)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
          <p className={cn("text-2xl font-bold font-display number-tabular", accentColor)}>
            {formatCurrency(value)}
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          variant === "income" && "bg-income/15 text-income",
          variant === "expense" && "bg-expense/15 text-expense",
          variant === "balance" && "bg-primary/15 text-primary",
          variant === "default" && "bg-muted text-muted-foreground",
        )}>
          {icon}
        </div>
      </div>
      {typeof trend === "number" && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-income" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-expense" />
          )}
          <span className={trend >= 0 ? "text-income" : "text-expense"}>
            {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">vs período anterior</span>
        </div>
      )}
    </div>
  );
}
