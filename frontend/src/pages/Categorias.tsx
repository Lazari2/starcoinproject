import { useState } from "react";
import { Tags, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { CategoryFormDialog } from "@/components/CategoryFormDialog";
import { useCategorias, useCategoriasMutations, useLimitesVerificados } from "@/hooks/useApi";
import { Category, CategoryKind } from "@/types/finance";
import { formatCurrency } from "@/lib/format";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Categorias() {
  const { data: categories = [] } = useCategorias();
  const { remove } = useCategoriasMutations();
  const now = new Date();
  const { data: limites = [] } = useLimitesVerificados(now.getMonth() + 1, now.getFullYear());

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [defaultKind, setDefaultKind] = useState<CategoryKind>("expense");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const renderList = (kind: CategoryKind) => {
    const items = categories.filter((c) => c.kind === kind);
    if (items.length === 0) {
      return <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">Nenhuma categoria.</div>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((c) => {
          const limite = limites.find((l) => l.categoria_id === c.id);
          const over = limite?.excedido;
          const pct = limite ? Math.min(100, limite.percentual) : 0;
          return (
            <div key={c.id} className="glass-card rounded-2xl p-4 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg" style={{ backgroundColor: `hsl(${c.color})` }} />
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground capitalize">{c.kind === "income" ? "Receita" : "Despesa"}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(c); setOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 hover:text-destructive" onClick={() => setConfirmId(c.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {c.kind === "expense" && limite ? (
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-muted-foreground">Mês atual</span>
                    <span className={`font-mono ${over ? "text-expense" : "text-muted-foreground"}`}>
                      {formatCurrency(limite.total_gasto)} / {formatCurrency(limite.valor_limite)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: over ? "hsl(var(--expense))" : `hsl(${c.color})` }} />
                  </div>
                </div>
              ) : c.kind === "expense" ? (
                <p className="text-[11px] text-muted-foreground mt-3">Sem limite definido</p>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Categorias"
        description="Personalize categorias e defina limites mensais"
        icon={<Tags className="h-6 w-6" />}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-1" /> Nova categoria
          </Button>
        }
      />

      <Tabs defaultValue="expense" onValueChange={(v) => setDefaultKind(v as CategoryKind)}>
        <TabsList className="mb-5">
          <TabsTrigger value="expense">Despesas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
        </TabsList>
        <TabsContent value="expense">{renderList("expense")}</TabsContent>
        <TabsContent value="income">{renderList("income")}</TabsContent>
      </Tabs>

      <CategoryFormDialog open={open} onOpenChange={setOpen} editing={editing} defaultKind={defaultKind} />

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>Transações vinculadas também serão removidas.</AlertDialogDescription>
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
