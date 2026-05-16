## Objetivo

Adicionar autenticação completa ao **Finova** usando **Lovable Cloud** (backend gerenciado, sem necessidade de conta Supabase externa) com perfis de usuário, roles (admin/user), recuperação de senha, login social (Google) e área de perfil — mantendo o frontend React + TypeScript existente.

## O que será entregue

### Backend

- Tabela `profiles` (id, full_name, avatar_url, email_verified, created_at) ligada a `auth.users` via FK + trigger `handle_new_user` para criação automática.
- Enum `app_role` (`admin`, `user`) + tabela `user_roles` (separada do profiles, conforme boas práticas de segurança).
- Função `has_role(_user_id, _role)` `SECURITY DEFINER` para uso em RLS.
- RLS em todas as tabelas: usuário vê/edita só seus dados; admin vê tudo.
- Tabela `auth_logs` para registrar eventos (login, logout, falhas).
- Migrar tabelas de finanças existentes (hoje em localStorage via Zustand) para o banco com `user_id` + RLS — **opcional nesta etapa**, ver pergunta abaixo.

### Frontend

**Páginas novas (em `src/pages/auth/`)**

- `Login.tsx` — email/senha + botão Google, "lembrar de mim", validação Zod, loading/erros.
- `SignUp.tsx` — nome, email, senha, confirmar senha, indicador de força, aceite de termos.
- `ForgotPassword.tsx` — solicitar email de recuperação.
- `ResetPassword.tsx` — definir nova senha (rota pública, lê token do hash `type=recovery`).
- `VerifyEmail.tsx` — feedback de verificação de email.
- `Profile.tsx` — editar nome/avatar, alterar senha, logout, ver sessões.
- `Unauthorized.tsx` (401/403) — tela de acesso negado.

**Infra de auth (em `src/`)**

- `contexts/AuthContext.tsx` — provider com `user`, `session`, `profile`, `roles`, `loading`. Usa `onAuthStateChange` antes de `getSession`.
- `hooks/useAuth.ts` — hook de consumo.
- `hooks/useRole.ts` — checagem de permissões.
- `hooks/useIdleLogout.ts` — logout automático por inatividade (30 min configurável).
- `components/auth/ProtectedRoute.tsx` — guard que exige login (e opcionalmente role).
- `components/auth/PasswordStrengthMeter.tsx` — barra visual de força.
- `lib/validation/auth.ts` — schemas Zod (senha forte: 8+ chars, maiúscula, número, especial).
- `lib/rateLimiter.ts` — rate limit visual no cliente (5 tentativas / 15 min) + bloqueio temporário.

**Integração com app existente**

- Atualizar `App.tsx`: envolver com `AuthProvider`, adicionar rotas públicas (`/auth/*`) e proteger rotas privadas (`/`, `/receitas`, etc.) com `ProtectedRoute`.
- Sidebar: mostrar avatar + nome + botão "Sair"; item "Admin" só para role admin.
- Sincronização entre abas via evento `storage` do Supabase (já é nativo do client).

## Detalhes técnicos

- **Login social**: apenas **Google** será habilitado de forma gerenciada pelo Lovable Cloud. Microsoft/Outlook **não é suportado nativamente** — exigiria conectar Supabase externo. Posso deixar o botão pronto + instruções, mas não funcionará até configuração manual.
- **2FA TOTP** (Google/Microsoft Authenticator): o Supabase suporta MFA nativo (`supabase.auth.mfa.enroll` retorna QR Code). Vou implementar enroll/verify/unenroll na página de Perfil.
- **Refresh token + expiração**: gerenciados automaticamente pelo client `@supabase/supabase-js`.
- **Armazenamento**: tokens em `localStorage` criptografado pelo client (padrão Supabase).
- **CSRF/XSS**: inputs sanitizados via Zod; sem `dangerouslySetInnerHTML`.
- **Logs de auth**: insert em `auth_logs` em login/logout/falha (via edge function ou direto do client com RLS apropriada).

## Estrutura de pastas resultante

```text
src/
├── contexts/AuthContext.tsx
├── hooks/useAuth.ts, useRole.ts, useIdleLogout.ts
├── components/auth/
│   ├── ProtectedRoute.tsx
│   ├── PasswordStrengthMeter.tsx
│   └── SocialLoginButtons.tsx
├── lib/validation/auth.ts
├── lib/rateLimiter.ts
└── pages/auth/
    ├── Login.tsx, SignUp.tsx
    ├── ForgotPassword.tsx, ResetPassword.tsx
    ├── VerifyEmail.tsx, Profile.tsx
    └── Unauthorized.tsx
```

## Fora do escopo desta entrega

- Migração das tabelas financeiras (Zustand→DB) — pode ser próxima etapa.
- Backend Flask — o sistema usará Lovable Cloud (Supabase). Posso documentar como migrar para Flask depois se quiser.
- Microsoft OAuth funcional (apenas UI preparada).

## Perguntas antes de implementar

1. Migrar os dados financeiros (contas, transações, metas) para o banco agora, ou manter em localStorage por enquanto e só adicionar auth?
2. Habilitar 2FA TOTP nesta entrega (mais complexo) ou deixar para uma segunda iteração?