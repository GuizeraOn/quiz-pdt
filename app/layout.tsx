import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Protocolo Desbloqueo Total | Descubre tu Tipo de Intestino',
  description: 'Responde 6 preguntas rápidas y descubre qué está frenando tu digestión en menos de 60 segundos. Protocolo Desbloqueo Total.',
  keywords: ['salud intestinal', 'digestión', 'tipo de intestino', 'protocolo desbloqueo total', 'microbiota', 'bienestar'],
  authors: [{ name: 'Protocolo Desbloqueo Total' }],
  openGraph: {
    title: 'Protocolo Desbloqueo Total | Descubre tu Tipo de Intestino',
    description: 'Responde 6 preguntas rápidas y descubre qué está frenando tu digestión en menos de 60 segundos.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Protocolo Desbloqueo Total',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protocolo Desbloqueo Total | Descubre tu Tipo de Intestino',
    description: 'Responde 6 preguntas rápidas y descubre qué está frenando tu digestión en menos de 60 segundos.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-50" suppressHydrationWarning>{children}</body>
    </html>
  );
}
