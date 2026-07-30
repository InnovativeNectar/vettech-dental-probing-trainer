'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/stores/useUserStore';
import { canAccessAdmin } from '@/lib/admin/rbac';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/setup', label: 'Setup', icon: '🚀' },
  { href: '/admin/courses', label: 'Courses', icon: '📚' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUserStore();

  if (!user || !canAccessAdmin(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-4xl">🔒</p>
          <p className="mt-4 text-lg font-semibold text-gray-900">Access Denied</p>
          <p className="mt-2 text-gray-500">
            You need admin or instructor privileges to access this area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900">Admin</h2>
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}