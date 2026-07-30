'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  createdAt: string;
  lessonCount: number;
}

export default function AdminCoursesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'intermediate', xpReward: 100 });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    try {
      const res = await fetch('/api/admin/modules');
      if (res.ok) setModules(await res.json());
    } catch {
      // silent
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/admin/modules/${editingId}` : '/api/admin/modules';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', description: '', difficulty: 'intermediate', xpReward: 100 });
    fetchModules();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this module?')) return;
    await fetch(`/api/admin/modules/${id}`, { method: 'DELETE' });
    fetchModules();
  }

  function startEdit(m: Module) {
    setEditingId(m.id);
    setForm({ title: m.title, description: m.description, difficulty: m.difficulty, xpReward: m.xpReward });
    setShowForm(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses & Modules</h1>
          <p className="mt-1 text-gray-500">Manage training modules and their lessons</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); }}>
          + New Module
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">{editingId ? 'Edit Module' : 'New Module'}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">XP Reward</label>
              <input type="number" min={0} value={form.xpReward} onChange={e => setForm({ ...form, xpReward: parseInt(e.target.value) })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {modules.map(m => (
          <div key={m.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{m.title}</h3>
              <p className="text-sm text-gray-500">{m.description}</p>
              <div className="mt-1 flex gap-4 text-xs text-gray-400">
                <span>{m.difficulty}</span>
                <span>{m.xpReward} XP</span>
                <span>{m.lessonCount} lessons</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => startEdit(m)}>Edit</Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(m.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {modules.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            No modules yet. Create your first module above.
          </div>
        )}
      </div>
    </div>
  );
}