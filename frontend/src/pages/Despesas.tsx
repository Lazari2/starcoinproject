import { useMemo, useState } from "react";
import { ArrowDownCircle, AlertTriangle, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PeriodToggle } from "@/components/PeriodToggle";
import { Button } from "@/components/ui/button";
import { TransactionFormDialog } from "@/components/TransactionFormDialog";
import { TransactionList } from "@/components/TransactionList";
import { useTransacoes, useLimitesVerificados } from "@/hooks/useApi";
import { usePeriodFilter } from "@/hooks/usePeriodFilter";
import { formatCurrency } from "@/lib/format";
import { Transaction } from "@/types/finance";

export default function Despesas() {
  const { data: transactions = [] } = useTransacoes();
  const now = new Date();
  const { data: limites = [] } = useLimitesVerificados(now.getMonth() + 1, now.getFullYear());
  const { period, setPeriod, filter } = usePeriodFilter("month");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const items = useMemo(
    () => filter(transactions).filter((t) => t.kind === "expense").sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [transactions, filter]
  );
  const total = items.reduce((s, t) => s + t.amount, 0);

  const overLimit = limites.filter((l) => l.excedido);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Despesas"
        description="Acompanhe seus gastos e respeite os limites"
        icon={<ArrowDownCircle className="h-6 w-6" />}
        actions={
          <>
            <PeriodToggle value={period} onChange={setPeriod} />
            <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-1" /> Nova despesa
            </Button>
          </>
        }
      />

      {overLimit.length > 0 && (
        <div className="glass-card rounded-2xl p-4 mb-6 border-expense/40 bg-expense/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-expense shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-expense">Limites ultrapassados este mês</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {overLimit.map((o) => (
                  <span key={o.id} className="text-xs bg-expense/15 text-expense px-2.5 py-1 rounded-full font-medium">
                    {o.categoria_nome}: {formatCurrency(o.total_gasto)} / {formatCurrency(o.valor_limite)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card bg-gradient-expense">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total no período</p>
          <p className="text-2xl font-bold font-display number-tabular text-expense mt-1">{formatCurrency(total)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Quantidade</p>
          <p className="text-2xl font-bold font-display mt-1">{items.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Média</p>
          <p className="text-2xl font-bold font-display number-tabular mt-1">{formatCurrency(items.length ? total / items.length : 0)}</p>
        </div>
      </div>

      <TransactionList
        transactions={items}
        onEdit={(t) => { setEditing(t); setOpen(true); }}
        emptyMessage="Nenhuma despesa no período."
      />

      <TransactionFormDialog open={open} onOpenChange={setOpen} kind="expense" editing={editing} />
    </div>
  );
}
