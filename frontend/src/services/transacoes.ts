import { api } from "@/lib/api";
import type { Transaction } from "@/types/finance";

interface ApiTransacao {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  id_categoria: string | null;
  id_conta: string | null;
  categoria_nome?: string;
  conta_nome?: string;
  created_at: string;
  updated_at: string;
}

function toTransaction(a: ApiTransacao, kind: "income" | "expense"): Transaction {
  return {
    id: a.id,
    description: a.descricao,
    amount: a.valor,
    date: a.data,
    categoryId: a.id_categoria ?? "",
    accountId: a.id_conta ?? "",
    kind,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  };
}

export const transacoesService = {
  list: async (filters?: { mes?: number; ano?: number }): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters?.mes) params.set("mes", String(filters.mes));
    if (filters?.ano) params.set("ano", String(filters.ano));
    const qs = params.toString() ? `?${params}` : "";

    const [resReceitas, resDespesas] = await Promise.all([
      api.get<{ receitas: ApiTransacao[] }>(`/api/receitas${qs}`),
      api.get<{ despesas: ApiTransacao[] }>(`/api/despesas${qs}`),
    ]);

    return [
      ...resReceitas.receitas.map((r) => toTransaction(r, "income")),
      ...resDespesas.despesas.map((d) => toTransaction(d, "expense")),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  create: async (payload: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Promise<Transaction> => {
    const body = {
      descricao: payload.description,
      valor: payload.amount,
      data: payload.date,
      id_categoria: payload.categoryId || null,
      id_conta: payload.accountId || null,
    };
    const isIncome = payload.kind === "income";
    const endpoint = isIncome ? "/api/receitas" : "/api/despesas";
    const key = isIncome ? "receita" : "despesa";
    const res = await api.post<Record<string, ApiTransacao>>(endpoint, body);
    return toTransaction(res[key], payload.kind);
  },

  update: async (id: string, kind: "income" | "expense", payload: Partial<Transaction>): Promise<Transaction> => {
    const body: Record<string, unknown> = {};
    if (payload.description !== undefined) body.descricao = payload.description;
    if (payload.amount !== undefined) body.valor = payload.amount;
    if (payload.date !== undefined) body.data = payload.date;
    if (payload.categoryId !== undefined) body.id_categoria = payload.categoryId || null;
    if (payload.accountId !== undefined) body.id_conta = payload.accountId || null;
    const isIncome = kind === "income";
    const endpoint = isIncome ? `/api/receitas/${id}` : `/api/despesas/${id}`;
    const key = isIncome ? "receita" : "despesa";
    const res = await api.put<Record<string, ApiTransacao>>(endpoint, body);
    return toTransaction(res[key], kind);
  },

  delete: (id: string, kind: "income" | "expense") => {
    const endpoint = kind === "income" ? `/api/receitas/${id}` : `/api/despesas/${id}`;
    return api.delete(endpoint);
  },
};
