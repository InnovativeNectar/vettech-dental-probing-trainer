'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';

interface LrsConfig {
  endpoint: string;
  auth: string;
  enabled: boolean;
}

export default function AdminSettingsPage() {
  const [lrs, setLrs] = useState<LrsConfig>({ endpoint: '', auth: '', enabled: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setLrs(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xapiLrs: lrs }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function updateLrs(key: keyof LrsConfig, value: string | boolean) {
    setLrs(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Settings</h1>
      <p className="mb-8 text-gray-500">Configure platform integrations and LRS settings</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">xAPI LRS Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enable xAPI Statements</label>
              <button
                type="button"
                role="switch"
                aria-checked={lrs.enabled}
                onClick={() => updateLrs('enabled', !lrs.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lrs.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lrs.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LRS Endpoint</label>
              <input
                type="url"
                value={lrs.endpoint}
                onChange={e => updateLrs('endpoint', e.target.value)}
                placeholder="https://lrs.example.com/xapi"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LRS Auth (Basic or Key)</label>
              <input
                type="text"
                value={lrs.auth}
                onChange={e => updateLrs('auth', e.target.value)}
                placeholder="Basic base64credentials or API key"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          {saved && <span className="text-sm text-green-600">Settings saved ✓</span>}
        </div>
      </form>
    </div>
  );
}