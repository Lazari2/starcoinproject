import { useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, LayoutDashboard, Wallet, Plus } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { PeriodToggle } from "@/components/PeriodToggle";
import { StatCard } from "@/components/StatCard";
import { useCategorias, useLimitesVerificados, useMetas, useTransacoes } from "@/hooks/useApi";
import { usePeriodFilter } from "@/hooks/usePeriodFilter";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { TransactionFormDialog } from "@/components/TransactionFormDialog";

export default function Dashboard() {
  const { data: transactions = [] } = useTransacoes();
  const { data: categories = [] } = useCategorias();
  const { data: goals = [] } = useMetas();
  const now = new Date();
  const { data: limites = [] } = useLimitesVerificados(now.getMonth() + 1, now.getFullYear());

  const { period, setPeriod, filter } = usePeriodFilter("month");
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);

  const filtered = filter(transactions);
  const totalIncome = filtered.filter((t) => t.kind === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.kind === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const series = useMemo(() => {
    const map = new Map<string, { label: string; receitas: number; despesas: number; ts: number }>();
    const useMonth = period === "year" || period === "all";
    filtered.forEach((t) => {
      const d = new Date(t.date);
      const key = useMonth
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = useMonth
        ? new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(d)
        : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      const cur = map.get(key) ?? { label, receitas: 0, despesas: 0, ts: d.getTime() };
      if (t.kind === "income") cur.receitas += t.amount;
      else cur.despesas += t.amount;
      map.set(key, cur);
    });
    return Array.from(map.values()).sort((a, b) => a.ts - b.ts);
  }, [filtered, period]);

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }>();
    filtered.filter((t) => t.kind === "expense").forEach((t) => {
      const cat = categories.find((c) => c.id === t.categoryId);
      if (!cat) return;
      const cur = map.get(cat.id) ?? { name: cat.name, value: 0, color: cat.color };
      cur.value += t.amount;
      map.set(cat.id, cur);
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [filtered, categories]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Visão geral das suas finanças"
        icon={<LayoutDashboard className="h-6 w-6" />}
        actions={
          <>
            <PeriodToggle value={period} onChange={setPeriod} />
            <Button onClick={() => setOpenIncome(true)} variant="outline" size="sm" className="border-income/40 hover:bg-income/10 text-income">
              <Plus className="h-4 w-4 mr-1" /> Receita
            </Button>
            <Button onClick={() => setOpenExpense(true)} variant="outline" size="sm" className="border-expense/40 hover:bg-expense/10 text-expense">
              <Plus className="h-4 w-4 mr-1" /> Despesa
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Saldo do período" value={balance} icon={<Wallet className="h-5 w-5" />} variant="balance" hint={balance >= 0 ? "Você está no positivo" : "Atenção ao saldo negativo"} />
        <StatCard label="Receitas" value={totalIncome} icon={<ArrowUpCircle className="h-5 w-5" />} variant="income" hint={`${filtered.filter(t => t.kind === "income").length} transações`} />
        <StatCard label="Despesas" value={totalExpense} icon={<ArrowDownCircle className="h-5 w-5" />} variant="expense" hint={`${filtered.filter(t => t.kind === "expense").length} transações`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Receitas vs Despesas</h3>
              <p className="text-xs text-muted-foreground">Evolução no período selecionado</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--income))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--income))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-expense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--expense))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--expense))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `R$${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="receitas" name="Receitas" stroke="hsl(var(--income))" strokeWidth={2} fill="url(#g-income)" />
                <Area type="monotone" dataKey="despesas" name="Despesas" stroke="hsl(var(--expense))" strokeWidth={2} fill="url(#g-expense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold">Gastos por categoria</h3>
          <p className="text-xs text-muted-foreground mb-2">Distribuição no período</p>
          {expenseByCategory.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Sem despesas no período</div>
          ) : (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseByCategory} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                      {expenseByCategory.map((e, i) => <Cell key={i} fill={`hsl(${e.color})`} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                      formatter={(v: number) => formatCurrency(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {expenseByCategory.slice(0, 4).map((e) => (
                  <div key={e.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(${e.color})` }} />
                      {e.name}
                    </span>
                    <span className="font-mono number-tabular">{formatCurrency(e.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold mb-4">🎯 Metas financeiras</h3>
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma meta cadastrada.</p>
          ) : (
            <div className="space-y-4">
              {goals.map((g) => {
                const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
                return (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium">{g.name}</span>
                      <span className="font-mono number-tabular text-xs text-muted-foreground">
                        {formatCurrency(g.currentAmount)} / {formatCurrency(g.targetAmount)}
                      </span>
                    </div>
                    <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                      <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: `hsl(${g.color})` }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{pct.toFixed(0)}% concluído</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold mb-4">⚡ Limites por categoria (mês)</h3>
          {limites.length === 0 ? (
            <p className="text-sm text-muted-foreground">Defina limites em Categorias para acompanhá-los aqui.</p>
          ) : (
            <div className="space-y-4">
              {limites.map((l) => {
                const pct = Math.min(200, l.percentual);
                const status = pct >= 100 ? "danger" : pct >= 80 ? "warning" : "ok";
                const barColor = status === "danger" ? "hsl(var(--expense))" : status === "warning" ? "hsl(var(--warning))" : "hsl(var(--income))";
                return (
                  <div key={l.id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium">{l.categoria_nome}</span>
                      <span className={`font-mono text-xs number-tabular ${status === "danger" ? "text-expense" : status === "warning" ? "text-warning" : "text-muted-foreground"}`}>
                        {formatCurrency(l.total_gasto)} / {formatCurrency(l.valor_limite)}
                      </span>
                    </div>
                    <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                      <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: barColor }} />
                    </div>
                    {status === "danger" && <p className="text-[11px] text-expense mt-1">⚠ Limite ultrapassado em {(pct - 100).toFixed(0)}%</p>}
                    {status === "warning" && <p className="text-[11px] text-warning mt-1">Atenção: {pct.toFixed(0)}% utilizado</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <TransactionFormDialog open={openIncome} onOpenChange={setOpenIncome} kind="income" />
      <TransactionFormDialog open={openExpense} onOpenChange={setOpenExpense} kind="expense" />
    </div>
  );
}
