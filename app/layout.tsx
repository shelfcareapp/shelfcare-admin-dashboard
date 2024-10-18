import './globals.css';
import type { Metadata } from 'next';
import ToastProvider from '@/components/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'Shelfcare Admin - Admin Panel',
  description: 'Shelfcare Admin'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {' '}
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
