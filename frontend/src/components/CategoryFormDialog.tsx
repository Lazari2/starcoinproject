import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategoriasMutations } from "@/hooks/useApi";
import { limitesService } from "@/services/limites";
import { Category, CategoryKind } from "@/types/finance";

const PALETTE = [
  "152 76% 52%", "168 76% 48%", "200 80% 56%", "217 92% 64%",
  "280 70% 64%", "330 80% 64%", "4 86% 64%", "20 90% 60%",
  "38 95% 60%", "60 80% 55%",
];

const schema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(40),
  kind: z.enum(["income", "expense"]),
  color: z.string(),
  monthlyLimit: z.coerce.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing?: Category | null;
  defaultKind?: CategoryKind;
}

export function CategoryFormDialog({ open, onOpenChange, editing, defaultKind = "expense" }: Props) {
  const { create, update } = useCategoriasMutations();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", kind: defaultKind, color: PALETTE[0] },
  });

  useEffect(() => {
    if (open) {
      reset(editing
        ? { name: editing.name, kind: editing.kind, color: editing.color, monthlyLimit: editing.monthlyLimit ?? undefined }
        : { name: "", kind: defaultKind, color: PALETTE[0], monthlyLimit: undefined });
    }
  }, [open, editing, defaultKind, reset]);

  const kind = watch("kind");
  const color = watch("color");

  const onSubmit = async (data: FormData) => {
    const now = new Date();
    const mes = now.getMonth() + 1;
    const ano = now.getFullYear();

    if (editing) {
      await update.mutateAsync({ id: editing.id, name: data.name, kind: data.kind, color: data.color });
      if (data.kind === "expense" && data.monthlyLimit) {
        await limitesService.upsert(editing.id, data.monthlyLimit, mes, ano).catch(() => null);
      }
    } else {
      const cat = await create.mutateAsync({ name: data.name, kind: data.kind, color: data.color });
      if (data.kind === "expense" && data.monthlyLimit && cat?.id) {
        await limitesService.upsert(cat.id, data.monthlyLimit, mes, ano).catch(() => null);
      }
    }
    onOpenChange(false);
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="font-display">{editing ? "Editar" : "Nova"} Categoria</DialogTitle>
          <DialogDescription>Organize suas transações por categoria.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="cat-name">Nome</Label>
            <Input id="cat-name" placeholder="Ex: Mercado" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={kind} onValueChange={(v) => setValue("kind", v as CategoryKind)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setValue("color", c)}
                  className={`h-8 w-8 rounded-lg border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: `hsl(${c})` }}
                />
              ))}
            </div>
          </div>
          {kind === "expense" && (
            <div>
              <Label htmlFor="limit">Limite mensal (opcional)</Label>
              <Input id="limit" type="number" step="0.01" placeholder="0,00" {...register("monthlyLimit")} />
              <p className="text-xs text-muted-foreground mt-1">Você receberá indicadores visuais ao se aproximar.</p>
            </div>
          )}
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
