import { Link } from "react-router-dom";
import { AuthShell } from "@/components/auth/AuthShell";

export default function ForgotPassword() {
  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Recuperação de senha"
      footer={
        <Link to="/auth/login" className="text-primary hover:underline font-medium">
          Voltar para o login
        </Link>
      }
    >
      <p className="text-sm text-muted-foreground text-center py-4">
        Para redefinir sua senha, entre em contato com o administrador do sistema.
      </p>
    </AuthShell>
  );
}
