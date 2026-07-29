import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VetTech Dental Probing Trainer',
  description: 'Interactive 3D dental probing simulation for veterinary technician education',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

/* Must be a client component to use usePathname, useUserStore */
import { AppShell } from '@/components/layout/AppShell';
