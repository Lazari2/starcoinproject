import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategorias, useContas, useTransacoesMutations } from "@/hooks/useApi";
import { Transaction } from "@/types/finance";

const schema = z.object({
  description: z.string().trim().min(1, "Descrição obrigatória").max(120),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  date: z.string().min(1, "Data obrigatória"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  accountId: z.string().min(1, "Selecione uma conta"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: "income" | "expense";
  editing?: Transaction | null;
}

export function TransactionFormDialog({ open, onOpenChange, kind, editing }: Props) {
  const { data: categories = [] } = useCategorias(kind);
  const { data: accounts = [] } = useContas();
  const { create, update } = useTransacoesMutations();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { description: "", amount: 0, date: new Date().toISOString().split("T")[0], categoryId: "", accountId: "" },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          description: editing.description,
          amount: editing.amount,
          date: editing.date.split("T")[0],
          categoryId: editing.categoryId,
          accountId: editing.accountId,
        });
      } else {
        reset({
          description: "",
          amount: 0 as unknown as number,
          date: new Date().toISOString().split("T")[0],
          categoryId: categories[0]?.id ?? "",
          accountId: accounts[0]?.id ?? "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      description: data.description,
      amount: data.amount,
      categoryId: data.categoryId,
      accountId: data.accountId,
      date: data.date,
      kind,
    };
    if (editing) {
      await update.mutateAsync({ id: editing.id, kind, ...payload });
    } else {
      await create.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editing ? "Editar" : "Nova"} {kind === "income" ? "Receita" : "Despesa"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da {kind === "income" ? "receita" : "despesa"} abaixo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Ex: Salário mensal" {...register("description")} />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" type="number" step="0.01" placeholder="0,00" {...register("amount")} />
              {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Categoria</Label>
              <Select value={watch("categoryId")} onValueChange={(v) => setValue("categoryId", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {categories.length === 0 && <div className="px-2 py-3 text-xs text-muted-foreground">Crie uma categoria primeiro</div>}
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(${c.color})` }} />
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId.message}</p>}
            </div>
            <div>
              <Label>Conta</Label>
              <Select value={watch("accountId")} onValueChange={(v) => setValue("accountId", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {accounts.length === 0 && <div className="px-2 py-3 text-xs text-muted-foreground">Crie uma conta primeiro</div>}
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountId && <p className="text-xs text-destructive mt-1">{errors.accountId.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              {editing ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
