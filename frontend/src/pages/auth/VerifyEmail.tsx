import { Link, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

export default function VerifyEmail() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  return (
    <AuthShell
      title="Verifique seu e-mail"
      subtitle="Quase lá! Confirme sua conta para começar"
      footer={
        <Link to="/auth/login" className="text-primary hover:underline font-medium">
          Voltar para o login
        </Link>
      }
    >
      <div className="text-center space-y-3 py-4">
        <Mail className="h-12 w-12 text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">
          Enviamos um link de confirmação para{" "}
          {email ? <span className="font-medium text-foreground">{email}</span> : "seu e-mail"}.
        </p>
        <p className="text-xs text-muted-foreground">
          Não recebeu? Verifique a pasta de spam ou aguarde alguns minutos.
        </p>
      </div>
    </AuthShell>
  );
}
