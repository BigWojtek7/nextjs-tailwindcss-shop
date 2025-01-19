import type { Metadata } from 'next';
import { roboto } from '@/app/ui/fonts';
import './ui/globals.css';
import { Header } from './ui/header/Header';
import { Footer } from './ui/footer/Footer';
import { CartProvider } from '@/app/context/CartContext';

export const metadata: Metadata = {
  title: 'E-Shop',
  description: 'Aplikacja e-commerce stworzona w Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={`${roboto.className} antialiased`}>
        <CartProvider>
          <Header />
          <main className="container mx-auto p-4">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
