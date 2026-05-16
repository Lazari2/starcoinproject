import { api } from "@/lib/api";

export interface LimiteCategoria {
  id: string;
  categoria_id: string;
  valor_limite: number;
  mes: number;
  ano: number;
}

export interface LimiteVerificado extends LimiteCategoria {
  categoria_nome: string;
  total_gasto: number;
  percentual: number;
  excedido: boolean;
}

export const limitesService = {
  list: async (mes?: number, ano?: number): Promise<LimiteCategoria[]> => {
    const params = new URLSearchParams();
    if (mes) params.set("mes", String(mes));
    if (ano) params.set("ano", String(ano));
    const qs = params.toString() ? `?${params}` : "";
    const res = await api.get<{ limites: LimiteCategoria[] }>(`/api/limites${qs}`);
    return res.limites;
  },

  verificar: async (mes?: number, ano?: number): Promise<LimiteVerificado[]> => {
    const params = new URLSearchParams();
    if (mes) params.set("mes", String(mes));
    if (ano) params.set("ano", String(ano));
    const qs = params.toString() ? `?${params}` : "";
    const res = await api.get<{ limites: LimiteVerificado[] }>(`/api/limites/verificar${qs}`);
    return res.limites;
  },

  upsert: async (categoriaId: string, valorLimite: number, mes: number, ano: number): Promise<LimiteCategoria> => {
    const existing = await limitesService.list(mes, ano);
    const found = existing.find((l) => l.categoria_id === categoriaId);
    if (found) {
      const res = await api.put<{ limite: LimiteCategoria }>(`/api/limites/${found.id}`, { valor_limite: valorLimite });
      return res.limite;
    }
    const res = await api.post<{ limite: LimiteCategoria }>("/api/limites", {
      categoria_id: categoriaId,
      valor_limite: valorLimite,
      mes,
      ano,
    });
    return res.limite;
  },

  delete: (id: string) => api.delete(`/api/limites/${id}`),
};
