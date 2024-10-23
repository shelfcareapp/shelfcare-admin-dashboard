import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import ToastProvider from 'components/providers/ToastProvider';
import StoreProvider from 'components/providers/StoreProvider';

export const metadata = {
  title: 'ShelfCare - Sustainable Fashion and Wardrobe Care',
  description:
    'ShelfCare admin dashboard for managing users, orders, and services.',
  openGraph: {
    title: 'ShelfCare - Sustainable Fashion and Wardrobe Care',
    description:
      'ShelfCare admin dashboard for managing users, orders, and services.',
    url: 'https://shelfcare.app',
    type: 'website',
    images: [
      {
        url: 'https://shelfcare.app/favicon.png',
        width: 1200,
        height: 630,
        alt: 'ShelfCare'
      }
    ]
  },
  icons: {
    icon: 'https://shelfcare.app/favicon.png'
  }
};

async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <ToastProvider>{children}</ToastProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
