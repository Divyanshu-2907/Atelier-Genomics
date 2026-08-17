import type { Metadata, Viewport } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { SmoothScroll } from '@/components/shared/SmoothScroll';
import { IntroSequence } from '@/components/intro/IntroSequence';
import { ReticleCursor } from '@/components/shared/ReticleCursor';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#06080a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Atelier Genomics — Computational Cell Therapy & Programmable Biology',
  description:
    'Pioneering de novo protein synthesis, cell targeting, and high-throughput genomic design for next-era therapeutics.',
  keywords: [
    'Biotechnology',
    'Computational Biology',
    'Cell Therapy',
    'CRISPR',
    'Protein Design',
    'Synthetic Biology',
    'Macromolecular Modeling',
    'Tissue Tropism',
  ],
  authors: [{ name: 'Atelier Genomics Engineering' }],
  openGraph: {
    title: 'Atelier Genomics — Computational Cell Therapy & Programmable Biology',
    description:
      'Pioneering de novo protein synthesis, targeted capsids, and high-throughput genomic telemetry.',
    type: 'website',
    siteName: 'Atelier Genomics',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atelier Genomics — Computational Cell Therapy',
    description:
      'Engineering biology for what comes next. De novo protein architectures & targeted capsids.',
  },
  icons: {
    icon: [
      { url: '/icon.png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-dvh flex flex-col bg-[#06080a] text-[#f3f4f1] font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300"
      >
        <IntroSequence />
        <ReticleCursor />
        <SmoothScroll>
          <Navbar />
          <div id="root-container" className="relative flex-1 flex flex-col w-full">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
