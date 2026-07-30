'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  institution: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', role: 'student', institution: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) setUsers(await res.json());
    } catch {
      // silent
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/admin/users/${editingId}` : '/api/admin/users';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    setEditingId(null);
    setForm({ email: '', name: '', role: 'student', institution: '' });
    fetchUsers();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user?')) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  }

  async function handleRoleChange(id: string, newRole: string) {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  }

  function startEdit(u: User) {
    setEditingId(u.id);
    setForm({ email: u.email, name: u.name, role: u.role, institution: u.institution ?? '' });
    setShowForm(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="mt-1 text-gray-500">Manage student, instructor, and admin accounts</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); }}>+ New User</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">{editingId ? 'Edit User' : 'New User'}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input type="text" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Institution</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} className="rounded border border-gray-300 px-2 py-1 text-xs">
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.institution ?? '--'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(u)}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(u.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}