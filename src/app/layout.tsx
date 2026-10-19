import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '../components/providers/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space',
});

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Holding Media Hub · Content Manager & Metrics (Multi-Canal)',
  description:
    'Centro neurálgico unificado de producción, sindicación multi-plataforma y analítica para BlackFlag Blueprint, Podmon y Level Pop.',
  icons: {
    icon: '/channels/blackflag-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#09090c] text-zinc-100 font-sans selection:bg-amber-500/20 selection:text-amber-300">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
