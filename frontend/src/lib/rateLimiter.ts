/**
 * Rate limiter visual para tentativas de login (client-side).
 * Persiste em localStorage para sobreviver a recargas.
 * NOTE: É apenas uma camada de UX — proteção real ocorre no backend.
 */
const KEY = "finova:login-attempts";
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const BLOCK_MS = 15 * 60 * 1000;

interface State {
  attempts: number;
  firstAt: number;
  blockedUntil?: number;
}

function read(): State {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "") as State;
  } catch {
    return { attempts: 0, firstAt: Date.now() };
  }
}

function write(state: State) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export const loginRateLimiter = {
  check(): { allowed: boolean; remaining: number; blockedFor?: number } {
    const s = read();
    const now = Date.now();
    if (s.blockedUntil && s.blockedUntil > now) {
      return { allowed: false, remaining: 0, blockedFor: Math.ceil((s.blockedUntil - now) / 1000) };
    }
    if (now - s.firstAt > WINDOW_MS) {
      write({ attempts: 0, firstAt: now });
      return { allowed: true, remaining: MAX_ATTEMPTS };
    }
    return { allowed: s.attempts < MAX_ATTEMPTS, remaining: Math.max(0, MAX_ATTEMPTS - s.attempts) };
  },
  registerFailure() {
    const s = read();
    const now = Date.now();
    const next: State =
      now - s.firstAt > WINDOW_MS
        ? { attempts: 1, firstAt: now }
        : { ...s, attempts: s.attempts + 1 };
    if (next.attempts >= MAX_ATTEMPTS) next.blockedUntil = now + BLOCK_MS;
    write(next);
  },
  reset() {
    localStorage.removeItem(KEY);
  },
};
