'use client';

import { CartProvider } from '@/app/context/CartContext';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <SessionProvider session={session}>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
