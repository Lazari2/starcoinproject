import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/finance";
import { useCategorias, useContas, useTransacoesMutations } from "@/hooks/useApi";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  emptyMessage?: string;
}

export function TransactionList({ transactions, onEdit, emptyMessage }: Props) {
  const { data: categories = [] } = useCategorias();
  const { data: accounts = [] } = useContas();
  const { remove } = useTransacoesMutations();

  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <p className="text-muted-foreground">{emptyMessage ?? "Nenhuma transação encontrada."}</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="divide-y divide-border">
        {transactions.map((t) => {
          const cat = categories.find((c) => c.id === t.categoryId);
          const acc = accounts.find((a) => a.id === t.accountId);
          const isIncome = t.kind === "income";
          return (
            <div key={t.id} className="group flex items-center gap-4 px-5 py-4 hover:bg-accent/30 transition-colors">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  isIncome ? "bg-income/15" : "bg-expense/15"
                )}
                style={cat ? { backgroundColor: `hsl(${cat.color} / 0.18)` } : {}}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: cat ? `hsl(${cat.color})` : (isIncome ? "hsl(var(--income))" : "hsl(var(--expense))") }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{t.description}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {cat?.name ?? "—"} • {acc?.name ?? "—"} • {formatDate(t.date)}
                </p>
              </div>
              <div className={cn("text-right font-semibold font-mono number-tabular shrink-0", isIncome ? "text-income" : "text-expense")}>
                {isIncome ? "+" : "−"}{formatCurrency(t.amount)}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" onClick={() => onEdit(t)} className="h-8 w-8">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove.mutate({ id: t.id, kind: t.kind })}
                  className="h-8 w-8 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
