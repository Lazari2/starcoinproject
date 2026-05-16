import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Wallet, Tags, Target, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Receitas", url: "/receitas", icon: ArrowUpCircle },
  { title: "Despesas", url: "/despesas", icon: ArrowDownCircle },
];

const manageItems = [
  { title: "Contas", url: "/contas", icon: Wallet },
  { title: "Categorias", url: "/categorias", icon: Tags },
  { title: "Metas", url: "/metas", icon: Target },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (url: string) => (url === "/" ? location.pathname === "/" : location.pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight leading-none">Star Coin Manager</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">Controle financeiro</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">Visão geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive(item.url) && "text-primary")} />
                      {!collapsed && <span>{item.title}</span>}
                      {isActive(item.url) && !collapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">Gerenciar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive(item.url) && "text-primary")} />
                      {!collapsed && <span>{item.title}</span>}
                      {isActive(item.url) && !collapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className="rounded-xl bg-gradient-primary/10 border border-primary/20 p-3">
            <p className="text-xs font-medium text-foreground">💡 Dica</p>
            <p className="text-xs text-muted-foreground mt-1">
              Defina limites por categoria para receber alertas automáticos.
            </p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
