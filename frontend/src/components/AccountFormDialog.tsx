import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useContasMutations } from "@/hooks/useApi";
import { Account } from "@/types/finance";

const TIPOS = [
  { value: "corrente", label: "Conta Corrente" },
  { value: "poupanca", label: "Poupança" },
  { value: "carteira", label: "Carteira" },
  { value: "investimento", label: "Investimento" },
  { value: "outro", label: "Outro" },
];

const schema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(60),
  tipo: z.string().min(1, "Selecione um tipo"),
  description: z.string().max(200).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing?: Account | null;
}

export function AccountFormDialog({ open, onOpenChange, editing }: Props) {
  const { create, update } = useContasMutations();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", tipo: "corrente", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset(editing
        ? { name: editing.name, tipo: "corrente", description: editing.description ?? "" }
        : { name: "", tipo: "corrente", description: "" });
    }
  }, [open, editing, reset]);

  const onSubmit = async (data: FormData) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, name: data.name, tipo: data.tipo, description: data.description });
    } else {
      await create.mutateAsync({ name: data.name, tipo: data.tipo, description: data.description });
    }
    onOpenChange(false);
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="font-display">{editing ? "Editar" : "Nova"} Conta</DialogTitle>
          <DialogDescription>Bancos, carteira, poupança…</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da conta</Label>
            <Input id="name" placeholder="Ex: Nubank" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={watch("tipo")} onValueChange={(v) => setValue("tipo", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIPOS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-xs text-destructive mt-1">{errors.tipo.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea id="description" rows={2} {...register("description")} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              {editing ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
