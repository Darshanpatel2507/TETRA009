import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

/**
 * Desktop / tablet shell — dark left sidebar + light surface main.
 * ≥md (≥768px), per spec.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 min-w-0 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
