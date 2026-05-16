import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { signUpSchema, type SignUpValues } from "@/lib/validation/auth";

export default function SignUp() {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false as unknown as true,
    },
  });

  const password = form.watch("password");

  const onSubmit = async (values: SignUpValues) => {
    setSubmitting(true);
    try {
      await register(values.fullName, values.email, values.password, values.confirmPassword);
      toast.success("Conta criada! Bem-vindo!");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      toast.error("Falha no cadastro", {
        description: err instanceof Error ? err.message : "Erro ao criar conta.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="Comece a controlar suas finanças em menos de 1 minuto"
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/auth/login" className="text-primary hover:underline font-medium">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nome de usuário</Label>
          <Input id="fullName" autoComplete="username" {...form.register("fullName")} />
          {form.formState.errors.fullName && (
            <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
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
              autoComplete="new-password"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label={showPwd ? "Ocultar" : "Mostrar"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={form.watch("acceptTerms") as unknown as boolean}
            onCheckedChange={(c) => form.setValue("acceptTerms", (c === true) as unknown as true, { shouldValidate: true })}
          />
          <Label htmlFor="terms" className="text-xs font-normal leading-snug cursor-pointer">
            Aceito os <a href="#" className="text-primary hover:underline">Termos de uso</a> e a{" "}
            <a href="#" className="text-primary hover:underline">Política de privacidade</a>.
          </Label>
        </div>
        {form.formState.errors.acceptTerms && (
          <p className="text-xs text-destructive">{form.formState.errors.acceptTerms.message as string}</p>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
        </Button>
      </form>
    </AuthShell>
  );
}
