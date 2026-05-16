import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    toast.success("Você saiu da sua conta.");
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Meu perfil" description="Informações da sua conta" />
      <div className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserIcon className="h-4 w-4" /> Dados da conta
            </CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Usuário</p>
              <p className="font-medium">{user?.username}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sair da conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
