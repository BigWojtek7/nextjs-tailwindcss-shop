'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { items, totalItems } = useCart();
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          E-Shop
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/products" className="text-gray-600 hover:text-gray-900">
            Produkty
          </Link>

          {session ? (
            <>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                Profil
              </Link>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-900"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="text-gray-600 hover:text-gray-900"
            >
              Zaloguj
            </Link>
          )}

          <Link href="/cart" className="relative">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}
