'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/stores/useUserStore';
import { canManageUsers } from '@/lib/admin/rbac';
import { Button } from '@/components/ui';

interface AuthConfig {
  allowRegistration: boolean;
  allowedDomains: string;
  sessionTtlHours: number;
}

interface SetupChecklist {
  firstAdminExists: boolean;
  hasUsers: boolean;
  databaseConnected: boolean;
  sessionConfigured: boolean;
}

export default function AdminSetupPage() {
  const { user } = useUserStore();
  const [auth, setAuth] = useState<AuthConfig>({
    allowRegistration: true,
    allowedDomains: '',
    sessionTtlHours: 24,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checklist, setChecklist] = useState<SetupChecklist>({
    firstAdminExists: false,
    hasUsers: false,
    databaseConnected: false,
    sessionConfigured: false,
  });
  const [userCounts, setUserCounts] = useState({ total: 0, admin: 0, instructor: 0, student: 0 });

  useEffect(() => {
    loadAuthConfig();
    checkSetup();
  }, []);

  async function loadAuthConfig() {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.auth) setAuth(data.auth);
      }
    } catch { /* silent */ }
  }

  async function checkSetup() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const stats = await res.json();
        setChecklist({
          databaseConnected: true,
          hasUsers: stats.totalUsers > 0,
          firstAdminExists: stats.adminCount > 0,
          sessionConfigured: true,
        });
        setUserCounts({
          total: stats.totalUsers ?? 0,
          admin: stats.adminCount ?? 0,
          instructor: stats.instructorCount ?? 0,
          student: stats.studentCount ?? 0,
        });
      }
    } catch { /* silent */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* silent */ }
    setSaving(false);
  }

  const allDone = checklist.databaseConnected && checklist.firstAdminExists && checklist.sessionConfigured;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Setup</h1>
      <p className="mb-8 text-gray-500">Configure authentication and platform settings</p>

      {/* Setup Checklist */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Setup Checklist</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={checklist.databaseConnected ? 'text-green-600' : 'text-gray-300'}>
              {checklist.databaseConnected ? '✅' : '⬜'}
            </span>
            <span className="text-sm text-gray-700">
              Database connected
              {!checklist.databaseConnected && <span className="ml-2 text-yellow-600">— awaiting connection</span>}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={checklist.firstAdminExists ? 'text-green-600' : 'text-gray-300'}>
              {checklist.firstAdminExists ? '✅' : '⬜'}
            </span>
            <span className="text-sm text-gray-700">
              At least one admin account exists
              {!checklist.firstAdminExists && (
                <Link href="/admin/users" className="ml-2 text-blue-600 underline">Create admin</Link>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={checklist.hasUsers ? 'text-green-600' : 'text-gray-300'}>
              {checklist.hasUsers ? '✅' : '⬜'}
            </span>
            <span className="text-sm text-gray-700">
              Users are provisioned
              {!checklist.hasUsers && (
                <Link href="/admin/users" className="ml-2 text-blue-600 underline">Add users</Link>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={checklist.sessionConfigured ? 'text-green-600' : 'text-gray-300'}>
              {checklist.sessionConfigured ? '✅' : '⬜'}
            </span>
            <span className="text-sm text-gray-700">
              Session & auth configured
              {!checklist.sessionConfigured && <span className="ml-2 text-yellow-600">— configure below</span>}
            </span>
          </div>
          {allDone && (
            <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              All setup steps complete. The platform is ready.
            </div>
          )}
        </div>
      </div>

      {/* User Summary */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-900">{userCounts.total}</p>
          <p className="text-xs text-gray-500">Total Users</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{userCounts.admin}</p>
          <p className="text-xs text-gray-500">Admins</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{userCounts.instructor}</p>
          <p className="text-xs text-gray-500">Instructors</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{userCounts.student}</p>
          <p className="text-xs text-gray-500">Students</p>
        </div>
      </div>

      {/* Auth Configuration */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Authentication</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Allow Open Registration</label>
                <p className="text-xs text-gray-400">Let anyone sign up without an invite</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={auth.allowRegistration}
                onClick={() => setAuth(prev => ({ ...prev, allowRegistration: !prev.allowRegistration }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${auth.allowRegistration ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${auth.allowRegistration ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Allowed Email Domains</label>
              <p className="mb-1 text-xs text-gray-400">Comma-separated (e.g., vettech.edu, pinnaclevet.edu). Leave empty for any domain.</p>
              <input
                type="text"
                value={auth.allowedDomains}
                onChange={e => setAuth(prev => ({ ...prev, allowedDomains: e.target.value }))}
                placeholder="vettech.edu, pinnaclevet.edu"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Session TTL (hours)</label>
              <p className="mb-1 text-xs text-gray-400">How long before a session expires</p>
              <input
                type="number"
                min={1}
                max={720}
                value={auth.sessionTtlHours}
                onChange={e => setAuth(prev => ({ ...prev, sessionTtlHours: Math.max(1, Number(e.target.value)) }))}
                className="mt-1 block w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Auth Settings'}
          </Button>
          {saved && <span className="text-sm text-green-600">Settings saved ✓</span>}
        </div>
      </form>

      {/* Quick Links */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/users">
            <Button variant="outline">Manage Users</Button>
          </Link>
          <Link href="/admin/courses">
            <Button variant="outline">Manage Courses</Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline">xAPI Settings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
