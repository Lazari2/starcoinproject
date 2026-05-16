import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { loginRateLimiter } from "@/lib/rateLimiter";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [blocked, setBlocked] = useState<number | null>(null);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: LoginValues) => {
    const limit = loginRateLimiter.check();
    if (!limit.allowed) {
      setBlocked(limit.blockedFor ?? null);
      toast.error("Muitas tentativas", {
        description: `Aguarde ${Math.ceil((limit.blockedFor ?? 0) / 60)} min antes de tentar novamente.`,
      });
      return;
    }

    setSubmitting(true);
    try {
      await login(values.email, values.password);
      loginRateLimiter.reset();
      toast.success("Bem-vindo de volta!");
      navigate(from, { replace: true });
    } catch (err: unknown) {
      loginRateLimiter.registerFailure();
      const remaining = loginRateLimiter.check().remaining;
      toast.error("Falha no login", {
        description: `${err instanceof Error ? err.message : "Credenciais inválidas"}. Tentativas restantes: ${remaining}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse sua conta para gerenciar suas finanças"
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link to="/auth/sign-up" className="text-primary hover:underline font-medium">
            Cadastre-se
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} aria-invalid={!!form.formState.errors.email} />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              {...form.register("password")}
              aria-invalid={!!form.formState.errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        {blocked !== null && (
          <p className="text-xs text-destructive">
            Conta temporariamente bloqueada. Tente novamente em ~{Math.ceil(blocked / 60)} min.
          </p>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
        </Button>
      </form>
    </AuthShell>
  );
}
