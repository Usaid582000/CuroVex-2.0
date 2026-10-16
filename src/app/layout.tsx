import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CuroVex | Biomedical Research Workspace',
  description:
    'An explainable research workspace for exploring biomedical networks and therapeutic hypotheses.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#F4F7F4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}