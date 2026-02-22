import type { ReactNode } from "react";

interface AppProviderProps {
  children: ReactNode;
}

// Thin wrapper kept for compatibility with entrypoint import
export function AppProvider({ children }: AppProviderProps) {
  return <>{children}</>;
}
