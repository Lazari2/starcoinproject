import { useState } from "react";
import { Target, Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { GoalFormDialog } from "@/components/GoalFormDialog";
import { useMetas, useMetasMutations } from "@/hooks/useApi";
import { Goal } from "@/types/finance";
import { formatCurrency, formatDate } from "@/lib/format";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Metas() {
  const { data: goals = [] } = useMetas();
  const { remove } = useMetasMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Metas"
        description="Defina objetivos e acompanhe seu progresso"
        icon={<Target className="h-6 w-6" />}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-1" /> Nova meta
          </Button>
        }
      />

      {goals.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
          Nenhuma meta cadastrada ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
            const completed = pct >= 100;
            const remaining = Math.max(0, g.targetAmount - g.currentAmount);
            return (
              <div key={g.id} className="stat-card group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${g.color} / 0.18)` }}>
                      {completed ? <CheckCircle2 className="h-5 w-5" style={{ color: `hsl(${g.color})` }} /> : <Target className="h-5 w-5" style={{ color: `hsl(${g.color})` }} />}
                    </div>
                    <div>
                      <p className="font-semibold font-display">{g.name}</p>
                      {g.deadline && <p className="text-[11px] text-muted-foreground">Prazo: {formatDate(g.deadline)}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(g); setOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 hover:text-destructive" onClick={() => setConfirmId(g.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-display font-bold text-2xl number-tabular" style={{ color: `hsl(${g.color})` }}>
                    {pct.toFixed(0)}%
                  </span>
                  <span className="text-xs text-muted-foreground font-mono number-tabular">
                    {formatCurrency(g.currentAmount)} / {formatCurrency(g.targetAmount)}
                  </span>
                </div>

                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: `hsl(${g.color})` }} />
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  {completed ? "🎉 Meta atingida!" : `Faltam ${formatCurrency(remaining)} para alcançar`}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <GoalFormDialog open={open} onOpenChange={setOpen} editing={editing} />

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir meta?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (confirmId) { remove.mutate(confirmId); setConfirmId(null); } }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
