# Star Coin Manager — Frontend

Interface web para gerenciamento financeiro pessoal. Permite controlar receitas, despesas, contas, categorias, metas e limites mensais de gastos.

## Tecnologias

- **React 18** + **TypeScript**
- **Vite** — bundler e servidor de desenvolvimento
- **TailwindCSS** + **shadcn/ui** — estilização e componentes
- **React Query (TanStack)** — gerenciamento de estado servidor
- **React Router 6** — roteamento
- **React Hook Form** + **Zod** — formulários e validação
- **Recharts** — gráficos

## Configuração

### Variáveis de ambiente

Copie `.env.example` para `.env`:

```env
VITE_API_URL=http://localhost:5000
```

### Instalação

```bash
npm install
npm run dev
```

Acesse: [http://localhost:8080](http://localhost:8080)

### Build para produção

```bash
npm run build
```

Os arquivos gerados ficam em `dist/`.

## Funcionalidades

- **Dashboard** — visão geral com gráficos de evolução e gastos por categoria
- **Receitas** — registro e listagem de entradas
- **Despesas** — registro com alertas de limite ultrapassado
- **Contas** — gerenciamento de contas bancárias e carteiras
- **Categorias** — organização com cores e limites mensais
- **Metas** — acompanhamento de objetivos financeiros
- **Autenticação** — login e cadastro com JWT

## Estrutura de pastas

```
src/
├── components/     # Componentes reutilizáveis
│   ├── auth/       # Componentes de autenticação
│   └── ui/         # Componentes shadcn/ui
├── contexts/       # Contexto de autenticação
├── hooks/          # Hooks React Query e utilitários
├── lib/            # Cliente HTTP, utilitários e formatação
├── pages/          # Páginas da aplicação
│   └── auth/       # Páginas de autenticação
├── services/       # Camada de integração com a API
└── types/          # Tipos TypeScript
```
