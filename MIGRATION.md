# Migração do projeto para `github.com/Lazari2/starcoinproject`

## Status atual
- Código consolidado em `main` no repositório `https://github.com/Lazari2/starcoinproject`
- `vercel.json` criado e commitado
- `render.yaml` presente para deploy backend via Render
- Etapa de dump de banco Neon foi pulada por solicitação

## O que atualizar no novo deploy

### Render
- Conectar o serviço ao repositório `https://github.com/Lazari2/starcoinproject`
- Usar `main` como branch de deploy
- Garantir que `render.yaml` esteja presente no repo
- Variáveis de ambiente necessárias:
  - `DATABASE_URL`
  - `JWT_SECRET_KEY`
  - `CORS_ORIGINS`
  - `FLASK_DEBUG`
  - `FLASK_APP`

### Vercel
- Conectar o projeto ao repositório `https://github.com/Lazari2/starcoinproject`
- Usar `main` como branch de deploy
- Configuração recomendada:
  - Root do projeto: `frontend`
  - Comando de build: `npm run build`
  - Output directory: `dist`
- Variáveis de ambiente do frontend, se necessárias:
  - `VITE_API_URL`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

## Domínio
- Após o deploy bem-sucedido, atualizar o domínio `https://starcoinmanager.com.br/`
  para apontar para o novo serviço/projeto ativo.

## Observações importantes
- Não deixe segredos no repo: use as variáveis de ambiente do Render/Vercel.
- `backend/.env.example` agora mostra o formato correto de `DATABASE_URL`.
- Se desejar, o próximo passo é validar o deploy em staging ou produção e depois excluir o repositório antigo `lucasramos45/starcoinproject`.
