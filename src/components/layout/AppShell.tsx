'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const HIDDEN_SIDEBAR_ROUTES = new Set(['/', '/login']);
const COLLAPSED_SIDEBAR_PREFIXES = ['/training/', '/cases/', '/assessment/'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    COLLAPSED_SIDEBAR_PREFIXES.some((prefix) => pathname.startsWith(prefix)),
  );
  const hideSidebar = HIDDEN_SIDEBAR_ROUTES.has(pathname);

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(prev => !prev)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarCollapsed(prev => !prev)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
