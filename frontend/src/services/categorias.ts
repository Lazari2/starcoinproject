import { api } from "@/lib/api";
import type { Category, CategoryKind } from "@/types/finance";

interface ApiCategoria {
  id: string;
  nome: string;
  tipo: string;
  descricao: string | null;
  created_at: string;
  updated_at: string;
}

// Cor armazenada como prefixo em descrição: "COLOR:152 76% 52%|descrição real"
function parseDescricao(raw: string | null): { color: string; descricao: string } {
  if (raw?.startsWith("COLOR:")) {
    const sep = raw.indexOf("|");
    return {
      color: raw.slice(6, sep === -1 ? undefined : sep),
      descricao: sep === -1 ? "" : raw.slice(sep + 1),
    };
  }
  return { color: "220 90% 56%", descricao: raw ?? "" };
}

function encodeDescricao(color: string, descricao: string): string {
  return `COLOR:${color}|${descricao}`;
}

function toCategory(a: ApiCategoria): Category {
  const { color, descricao } = parseDescricao(a.descricao);
  return {
    id: a.id,
    name: a.nome,
    kind: a.tipo === "receita" ? "income" : ("expense" as CategoryKind),
    color,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
    // limitesMensais é carregado separadamente pelo serviço de limites
  };
}

export const categoriasService = {
  list: async (kind?: CategoryKind): Promise<Category[]> => {
    const path = kind ? `/api/categorias?tipo=${kind === "income" ? "receita" : "despesa"}` : "/api/categorias";
    const data = await api.get<{ categorias: ApiCategoria[] }>(path);
    return data.categorias.map(toCategory);
  },

  create: async (payload: { name: string; kind: CategoryKind; color: string; descricao?: string }): Promise<Category> => {
    const res = await api.post<{ categoria: ApiCategoria }>("/api/categorias", {
      nome: payload.name,
      tipo: payload.kind === "income" ? "receita" : "despesa",
      descricao: encodeDescricao(payload.color, payload.descricao ?? ""),
    });
    return toCategory(res.categoria);
  },

  update: async (id: string, payload: { name?: string; kind?: CategoryKind; color?: string; descricao?: string }): Promise<Category> => {
    const body: Record<string, string> = {};
    if (payload.name) body.nome = payload.name;
    if (payload.kind) body.tipo = payload.kind === "income" ? "receita" : "despesa";
    if (payload.color !== undefined || payload.descricao !== undefined) {
      body.descricao = encodeDescricao(payload.color ?? "220 90% 56%", payload.descricao ?? "");
    }
    const res = await api.put<{ categoria: ApiCategoria }>(`/api/categorias/${id}`, body);
    return toCategory(res.categoria);
  },

  delete: (id: string) => api.delete(`/api/categorias/${id}`),
};
