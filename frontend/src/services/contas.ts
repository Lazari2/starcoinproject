import { api } from "@/lib/api";
import type { Account, AccountType } from "@/types/finance";

interface ApiConta {
  id: string;
  nome: string;
  tipo: string;
  descricao: string | null;
  saldo: number;
  created_at: string;
  updated_at: string;
}

// Tipos backend: corrente, poupança, carteira, investimento, outro
// Tipos frontend: receita, despesa, ambos
// Mapeamento: qualquer tipo do backend → "both" (contas não mapeiam 1:1 com receita/despesa)
function toAccount(a: ApiConta): Account {
  return {
    id: a.id,
    name: a.nome,
    type: "both" as AccountType,
    description: a.descricao ?? undefined,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  };
}

export const contasService = {
  list: async (): Promise<Account[]> => {
    const data = await api.get<{ contas: ApiConta[] }>("/api/contas");
    return data.contas.map(toAccount);
  },

  create: async (payload: { name: string; tipo: string; description?: string }): Promise<Account> => {
    const res = await api.post<{ conta: ApiConta }>("/api/contas", {
      nome: payload.name,
      tipo: payload.tipo,
      descricao: payload.description ?? "",
    });
    return toAccount(res.conta);
  },

  update: async (id: string, payload: { name?: string; tipo?: string; description?: string }): Promise<Account> => {
    const body: Record<string, string> = {};
    if (payload.name) body.nome = payload.name;
    if (payload.tipo) body.tipo = payload.tipo;
    if (payload.description !== undefined) body.descricao = payload.description;
    const res = await api.put<{ conta: ApiConta }>(`/api/contas/${id}`, body);
    return toAccount(res.conta);
  },

  delete: (id: string) => api.delete(`/api/contas/${id}`),
};
