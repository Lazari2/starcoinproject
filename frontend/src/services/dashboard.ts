import { api } from "@/lib/api";

export interface DashboardResumo {
  total_receitas: number;
  total_despesas: number;
  saldo: number;
  mes: number;
  ano: number;
}

export interface DespesaPorCategoria {
  categoria_id: string;
  categoria_nome: string;
  total: number;
}

export interface EvolucaoMensal {
  mes: number;
  ano: number;
  total_receitas: number;
  total_despesas: number;
  saldo: number;
}

export const dashboardService = {
  resumo: (mes?: number, ano?: number): Promise<DashboardResumo> => {
    const params = new URLSearchParams();
    if (mes) params.set("mes", String(mes));
    if (ano) params.set("ano", String(ano));
    const qs = params.toString() ? `?${params}` : "";
    return api.get<DashboardResumo>(`/api/dashboard/resumo${qs}`);
  },

  despesasPorCategoria: async (mes?: number, ano?: number): Promise<DespesaPorCategoria[]> => {
    const params = new URLSearchParams();
    if (mes) params.set("mes", String(mes));
    if (ano) params.set("ano", String(ano));
    const qs = params.toString() ? `?${params}` : "";
    const res = await api.get<{ dados: DespesaPorCategoria[] }>(`/api/dashboard/despesas-por-categoria${qs}`);
    return res.dados;
  },

  evolucaoMensal: (): Promise<EvolucaoMensal[]> =>
    api.get<EvolucaoMensal[]>("/api/dashboard/evolucao-mensal"),
};
