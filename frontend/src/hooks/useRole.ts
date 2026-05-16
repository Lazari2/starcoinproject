export function useRole() {
  return {
    roles: [] as string[],
    has: (_role: string) => true,
    isAdmin: false,
  };
}
