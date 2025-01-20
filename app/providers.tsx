'use client';

import { CartProvider } from '@/app/context/CartContext';
import { SessionProvider } from 'next-auth/react';

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
