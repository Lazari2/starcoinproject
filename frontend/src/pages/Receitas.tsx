import { useMemo, useState } from "react";
import { ArrowUpCircle, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PeriodToggle } from "@/components/PeriodToggle";
import { Button } from "@/components/ui/button";
import { TransactionFormDialog } from "@/components/TransactionFormDialog";
import { TransactionList } from "@/components/TransactionList";
import { useTransacoes } from "@/hooks/useApi";
import { usePeriodFilter } from "@/hooks/usePeriodFilter";
import { formatCurrency } from "@/lib/format";
import { Transaction } from "@/types/finance";

export default function Receitas() {
  const { data: transactions = [] } = useTransacoes();
  const { period, setPeriod, filter } = usePeriodFilter("month");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const items = useMemo(
    () => filter(transactions).filter((t) => t.kind === "income").sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [transactions, filter]
  );
  const total = items.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Receitas"
        description="Registre e organize todas as suas entradas"
        icon={<ArrowUpCircle className="h-6 w-6" />}
        actions={
          <>
            <PeriodToggle value={period} onChange={setPeriod} />
            <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-1" /> Nova receita
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card bg-gradient-income">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total no período</p>
          <p className="text-2xl font-bold font-display number-tabular text-income mt-1">{formatCurrency(total)}</p>
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
        emptyMessage="Nenhuma receita no período. Adicione a primeira!"
      />

      <TransactionFormDialog open={open} onOpenChange={setOpen} kind="income" editing={editing} />
    </div>
  );
}
