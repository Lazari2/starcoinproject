import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMetasMutations } from "@/hooks/useApi";
import { Goal } from "@/types/finance";

const PALETTE = ["152 76% 52%", "200 80% 56%", "280 70% 64%", "38 95% 60%", "330 80% 64%"];

const schema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(60),
  targetAmount: z.coerce.number().positive("Meta deve ser positiva"),
  currentAmount: z.coerce.number().min(0),
  deadline: z.string().optional(),
  color: z.string(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing?: Goal | null;
}

export function GoalFormDialog({ open, onOpenChange, editing }: Props) {
  const { create, update } = useMetasMutations();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", targetAmount: 0, currentAmount: 0, color: PALETTE[0] },
  });

  useEffect(() => {
    if (open) {
      reset(editing
        ? { name: editing.name, targetAmount: editing.targetAmount, currentAmount: editing.currentAmount, deadline: editing.deadline?.split("T")[0], color: editing.color }
        : { name: "", targetAmount: 0 as unknown as number, currentAmount: 0, color: PALETTE[0] });
    }
  }, [open, editing, reset]);

  const color = watch("color");

  const onSubmit = async (data: FormData) => {
    const payload = {
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      color: data.color,
      deadline: data.deadline || undefined,
    };
    if (editing) {
      await update.mutateAsync({ id: editing.id, ...payload });
    } else {
      await create.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="font-display">{editing ? "Editar" : "Nova"} Meta</DialogTitle>
          <DialogDescription>Acompanhe seus objetivos financeiros.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="g-name">Nome</Label>
            <Input id="g-name" placeholder="Ex: Reserva de emergência" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="target">Valor alvo</Label>
              <Input id="target" type="number" step="0.01" {...register("targetAmount")} />
              {errors.targetAmount && <p className="text-xs text-destructive mt-1">{errors.targetAmount.message}</p>}
            </div>
            <div>
              <Label htmlFor="current">Valor atual</Label>
              <Input id="current" type="number" step="0.01" {...register("currentAmount")} />
            </div>
          </div>
          <div>
            <Label htmlFor="deadline">Prazo (opcional)</Label>
            <Input id="deadline" type="date" {...register("deadline")} />
          </div>
          <div>
            <Label>Cor</Label>
            <div className="flex gap-2 mt-2">
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
