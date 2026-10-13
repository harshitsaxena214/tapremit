import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  title: 'TapRemit · Trust-First Programmable Payments',
  description: 'Stablecoin remittance layer with AI proposal flow, deterministic policy engine, and human approval.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 min-h-screen flex flex-col antialiased">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
