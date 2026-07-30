'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface AdminStats {
  totalStudents: number;
  totalInstructors: number;
  totalModules: number;
  totalSessions: number;
  totalAssignments: number;
  avgCompletionRate: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) setStats(await res.json());
      } catch {
        // silent
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
      <p className="mb-8 text-gray-500">Overview of platform activity and user metrics</p>

      {stats ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Students" value={stats.totalStudents} icon="👥" />
          <StatCard label="Instructors" value={stats.totalInstructors} icon="👨‍🏫" />
          <StatCard label="Modules" value={stats.totalModules} icon="📚" />
          <StatCard label="Active Sessions" value={stats.totalSessions} icon="🟢" />
          <StatCard label="Assignments" value={stats.totalAssignments} icon="📝" />
          <StatCard label="Avg Completion" value={`${stats.avgCompletionRate}%`} icon="📈" />
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-gray-500">Loading stats...</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link href="/admin/courses" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Manage Courses</h3>
          <p className="mt-1 text-sm text-gray-500">Create and organize training modules and lessons</p>
        </Link>
        <Link href="/admin/users" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
          <p className="mt-1 text-sm text-gray-500">View and manage student and instructor accounts</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}