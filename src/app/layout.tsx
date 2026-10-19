import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '../components/providers/ClientProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Holding Media Hub · Content Manager & Metrics (Multi-Canal)',
  description:
    'Centro neurálgico unificado de producción, sindicación multi-plataforma y analítica de audiencias para todos los canales de la empresa (BlackFlag Blueprint, Podmon, Neon Marbles).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
