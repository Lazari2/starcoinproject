import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoriasService } from "@/services/categorias";
import { contasService } from "@/services/contas";
import { transacoesService } from "@/services/transacoes";
import { metasService } from "@/services/metas";
import { limitesService } from "@/services/limites";
import { dashboardService } from "@/services/dashboard";
import type { Category, CategoryKind, Account, Transaction, Goal } from "@/types/finance";

// ─── Categorias ─────────────────────────────────────────────────────
export function useCategorias(kind?: CategoryKind) {
  return useQuery({
    queryKey: ["categorias", kind],
    queryFn: () => categoriasService.list(kind),
  });
}

export function useCategoriasMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["categorias"] });

  const create = useMutation({
    mutationFn: (p: Parameters<typeof categoriasService.create>[0]) => categoriasService.create(p),
    onSuccess: () => { invalidate(); toast.success("Categoria criada!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ id, ...p }: { id: string } & Parameters<typeof categoriasService.update>[1]) =>
      categoriasService.update(id, p),
    onSuccess: () => { invalidate(); toast.success("Categoria atualizada!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => categoriasService.delete(id),
    onSuccess: () => { invalidate(); toast.success("Categoria excluída!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { create, update, remove };
}

// ─── Contas ──────────────────────────────────────────────────────────
export function useContas() {
  return useQuery({
    queryKey: ["contas"],
    queryFn: () => contasService.list(),
  });
}

export function useContasMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["contas"] });

  const create = useMutation({
    mutationFn: (p: Parameters<typeof contasService.create>[0]) => contasService.create(p),
    onSuccess: () => { invalidate(); toast.success("Conta criada!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ id, ...p }: { id: string } & Parameters<typeof contasService.update>[1]) =>
      contasService.update(id, p),
    onSuccess: () => { invalidate(); toast.success("Conta atualizada!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => contasService.delete(id),
    onSuccess: () => { invalidate(); toast.success("Conta excluída!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { create, update, remove };
}

// ─── Transações ──────────────────────────────────────────────────────
export function useTransacoes(filters?: { mes?: number; ano?: number }) {
  return useQuery({
    queryKey: ["transacoes", filters],
    queryFn: () => transacoesService.list(filters),
  });
}

export function useTransacoesMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["transacoes"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
    qc.invalidateQueries({ queryKey: ["limites"] });
  };

  const create = useMutation({
    mutationFn: (p: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => transacoesService.create(p),
    onSuccess: (_, v) => {
      invalidate();
      toast.success(v.kind === "income" ? "Receita adicionada!" : "Despesa adicionada!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ id, kind, ...p }: { id: string; kind: "income" | "expense" } & Partial<Transaction>) =>
      transacoesService.update(id, kind, p),
    onSuccess: () => { invalidate(); toast.success("Transação atualizada!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: ({ id, kind }: { id: string; kind: "income" | "expense" }) => transacoesService.delete(id, kind),
    onSuccess: () => { invalidate(); toast.success("Transação excluída!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { create, update, remove };
}

// ─── Metas ───────────────────────────────────────────────────────────
export function useMetas() {
  return useQuery({
    queryKey: ["metas"],
    queryFn: () => metasService.list(),
  });
}

export function useMetasMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["metas"] });

  const create = useMutation({
    mutationFn: (p: Omit<Goal, "id" | "createdAt" | "updatedAt">) => metasService.create(p),
    onSuccess: () => { invalidate(); toast.success("Meta criada!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ id, ...p }: { id: string } & Partial<Goal>) => metasService.update(id, p),
    onSuccess: () => { invalidate(); toast.success("Meta atualizada!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => metasService.delete(id),
    onSuccess: () => { invalidate(); toast.success("Meta excluída!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { create, update, remove };
}

// ─── Limites ─────────────────────────────────────────────────────────
export function useLimitesVerificados(mes?: number, ano?: number) {
  return useQuery({
    queryKey: ["limites", "verificar", mes, ano],
    queryFn: () => limitesService.verificar(mes, ano),
  });
}

// ─── Dashboard ───────────────────────────────────────────────────────
export function useDashboard(mes?: number, ano?: number) {
  return useQuery({
    queryKey: ["dashboard", "resumo", mes, ano],
    queryFn: () => dashboardService.resumo(mes, ano),
  });
}

export function useDespesasPorCategoria(mes?: number, ano?: number) {
  return useQuery({
    queryKey: ["dashboard", "categorias", mes, ano],
    queryFn: () => dashboardService.despesasPorCategoria(mes, ano),
  });
}

export function useEvolucaoMensal() {
  return useQuery({
    queryKey: ["dashboard", "evolucao"],
    queryFn: () => dashboardService.evolucaoMensal(),
  });
}
