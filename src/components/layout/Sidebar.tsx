'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/training', label: 'Training', icon: '🦷' },
  { href: '/cases', label: 'Clinical Cases', icon: '📋' },
  { href: '/assessment', label: 'Assessments', icon: '📝' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
];

const adminItems = [
  { href: '/admin', label: 'Admin Panel', icon: '⚙️' },
  { href: '/admin/settings', label: 'Settings', icon: '🔧' },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
        {!collapsed && <span className="text-lg font-bold text-gray-900">🦷 VetTech Prober</span>}
        <button
          onClick={onToggle}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M3 4.5L10.5 12 3 19.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5M5.25 4.5L12.75 12l-7.5 7.5" />
            )}
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              collapsed ? 'justify-center' : '',
              pathname === item.href || pathname.startsWith(item.href + '/')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <span>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-3">
        {!collapsed && (
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">Admin</p>
        )}
        {adminItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              collapsed ? 'justify-center' : '',
              pathname === item.href
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <span>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}
