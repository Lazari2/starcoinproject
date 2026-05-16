import { api } from "@/lib/api";
import type { Goal } from "@/types/finance";

interface ApiMeta {
  id: string;
  titulo: string;
  descricao: string | null;
  valor_alvo: number;
  valor_atual: number;
  data_limite: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// Cor armazenada em descrição com o mesmo esquema das categorias
function parseDescricao(raw: string | null): { color: string } {
  if (raw?.startsWith("COLOR:")) {
    const sep = raw.indexOf("|");
    return { color: raw.slice(6, sep === -1 ? undefined : sep) };
  }
  return { color: "220 90% 56%" };
}

function encodeDescricao(color: string): string {
  return `COLOR:${color}|`;
}

function toGoal(a: ApiMeta): Goal {
  const { color } = parseDescricao(a.descricao);
  return {
    id: a.id,
    name: a.titulo,
    targetAmount: a.valor_alvo,
    currentAmount: a.valor_atual,
    deadline: a.data_limite ?? undefined,
    color,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  };
}

export const metasService = {
  list: async (): Promise<Goal[]> => {
    const res = await api.get<{ metas: ApiMeta[] }>("/api/metas");
    return res.metas.map(toGoal);
  },

  create: async (payload: Omit<Goal, "id" | "createdAt" | "updatedAt">): Promise<Goal> => {
    const res = await api.post<{ meta: ApiMeta }>("/api/metas", {
      titulo: payload.name,
      valor_alvo: payload.targetAmount,
      valor_atual: payload.currentAmount,
      data_limite: payload.deadline ?? null,
      descricao: encodeDescricao(payload.color),
    });
    return toGoal(res.meta);
  },

  update: async (id: string, payload: Partial<Goal>): Promise<Goal> => {
    const body: Record<string, unknown> = {};
    if (payload.name !== undefined) body.titulo = payload.name;
    if (payload.targetAmount !== undefined) body.valor_alvo = payload.targetAmount;
    if (payload.currentAmount !== undefined) body.valor_atual = payload.currentAmount;
    if (payload.deadline !== undefined) body.data_limite = payload.deadline ?? null;
    if (payload.color !== undefined) body.descricao = encodeDescricao(payload.color);
    const res = await api.put<{ meta: ApiMeta }>(`/api/metas/${id}`, body);
    return toGoal(res.meta);
  },

  delete: (id: string) => api.delete(`/api/metas/${id}`),
};
