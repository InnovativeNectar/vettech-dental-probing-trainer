'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const loadDemoUser = useUserStore((s) => s.loadDemoUser);
  const setUser = useUserStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        const res = await fetch('/api/auth/[...nextauth]', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('vettech-session', JSON.stringify(data));
          setUser(data.user);
          router.push('/dashboard');
          return;
        }

        const body = await res.json();
        setError(body.error || 'Login failed');
      } catch {
        setError('Network error — could not reach server');
      } finally {
        setLoading(false);
      }
    },
    [email, password, setUser, router]
  );

  const handleDemoLogin = useCallback(() => {
    loadDemoUser();
    router.push('/dashboard');
  }, [loadDemoUser, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="text-4xl mb-2">🦷</div>
          <h1 className="text-2xl font-bold text-gray-900">VetTech Dental Prober</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to continue your training</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="student@vettech.edu"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="mb-3 text-center text-xs text-gray-400">Or start with a demo account</p>
          <Button variant="outline" onClick={handleDemoLogin} className="w-full">
            Launch Demo Mode
          </Button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Demo credentials</p>
          <p className="mt-1">student@vettech.edu / any password</p>
          <p>instructor@pinnaclevet.edu / any password</p>
          <p>admin@vetacademy.edu / any password</p>
        </div>
      </div>
    </div>
  );
}