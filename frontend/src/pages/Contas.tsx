import { useState } from "react";
import { Wallet, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { AccountFormDialog } from "@/components/AccountFormDialog";
import { useContas, useContasMutations, useTransacoes } from "@/hooks/useApi";
import { Account } from "@/types/finance";
import { formatCurrency } from "@/lib/format";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Contas() {
  const { data: accounts = [] } = useContas();
  const { data: transactions = [] } = useTransacoes();
  const { remove } = useContasMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const computeBalance = (id: string) => {
    const txs = transactions.filter((t) => t.accountId === id);
    const inc = txs.filter(t => t.kind === "income").reduce((s, t) => s + t.amount, 0);
    const exp = txs.filter(t => t.kind === "expense").reduce((s, t) => s + t.amount, 0);
    return { balance: inc - exp, count: txs.length };
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Contas"
        description="Bancos, carteiras e onde seu dinheiro circula"
        icon={<Wallet className="h-6 w-6" />}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-1" /> Nova conta
          </Button>
        }
      />

      {accounts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">Nenhuma conta cadastrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a) => {
            const { balance, count } = computeBalance(a.id);
            return (
              <div key={a.id} className="stat-card group relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{a.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(a); setOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 hover:text-destructive" onClick={() => setConfirmId(a.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {a.description && <p className="text-xs text-muted-foreground mt-3">{a.description}</p>}
                <div className="mt-4 pt-4 border-t border-border flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Saldo</p>
                    <p className={`font-display font-bold text-lg number-tabular ${balance >= 0 ? "text-income" : "text-expense"}`}>
                      {formatCurrency(balance)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{count} transações</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AccountFormDialog open={open} onOpenChange={setOpen} editing={editing} />

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmId) {
                  remove.mutate(confirmId);
                  setConfirmId(null);
                }
              }}
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
