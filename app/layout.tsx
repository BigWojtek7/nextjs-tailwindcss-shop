import type { Metadata } from 'next';
import { roboto } from '@/app/ui/fonts';
import './ui/globals.css';
import { Header } from './ui/header/Header';
import { Footer } from './ui/footer/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from './lib/authOptions';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'E-Shop',
  description: 'Aplikacja e-commerce stworzona w Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="pl">
      <body
        className={`${roboto.className} flex min-h-screen flex-col antialiased`}
      >
        <Providers session={session}>
          <Header />
          <main className="container mx-auto flex-1 p-4">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
