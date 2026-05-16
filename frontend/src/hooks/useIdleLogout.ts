import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

const IDLE_MS = 30 * 60 * 1000; // 30 min
const EVENTS = ["mousedown", "keydown", "touchstart", "scroll"] as const;

/** Faz logout automático após inatividade prolongada. */
export function useIdleLogout(idleMs: number = IDLE_MS) {
  const { user, signOut } = useAuth();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;

    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        toast.warning("Sessão encerrada por inatividade.");
        await signOut();
      }, idleMs);
    };

    EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, reset));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [user, signOut, idleMs]);
}
