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
        {children}
      </body>
    </html>
  );
}
