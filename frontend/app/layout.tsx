import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trapdar - Escape Tourist Traps',
  description: 'Discover authentic local experiences and avoid tourist traps with Trapdar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 