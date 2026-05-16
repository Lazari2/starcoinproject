import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-hero">
      <div className="glass-card rounded-2xl p-8 max-w-md text-center space-y-4">
        <ShieldAlert className="h-14 w-14 text-warning mx-auto" />
        <h1 className="font-display text-2xl font-bold">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">
          Você não tem permissão para acessar esta área. Se acha que é um engano, entre em contato com um administrador.
        </p>
        <Button asChild>
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}
