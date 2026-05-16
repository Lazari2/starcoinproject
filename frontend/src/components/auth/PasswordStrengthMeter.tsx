import { passwordStrength } from "@/lib/validation/auth";
import { cn } from "@/lib/utils";

const COLORS = [
  "bg-destructive",
  "bg-expense",
  "bg-warning",
  "bg-info",
  "bg-income",
];

export function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label } = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-muted transition-colors",
              i < score && COLORS[score]
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Força da senha: <span className="font-medium text-foreground">{label}</span>
      </p>
    </div>
  );
}
