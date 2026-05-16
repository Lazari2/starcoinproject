import { Link } from "react-router-dom";
import { AuthShell } from "@/components/auth/AuthShell";

export default function ResetPassword() {
  return (
    <AuthShell title="Redefinir senha" subtitle="">
      <p className="text-sm text-muted-foreground text-center py-4">
        Link inválido ou expirado.{" "}
        <Link to="/auth/forgot-password" className="text-primary hover:underline">
          Solicitar novo link
        </Link>
      </p>
    </AuthShell>
  );
}
