'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export const Header = () => {
  const { cartItems } = useCart();

  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          E-Shop
        </Link>
      </div>
      <div className="flex-none">
        <Link href="/cart" className="btn btn-primary">
          Koszyk ({cartItems.length})
        </Link>
      </div>
    </header>
  );
};
