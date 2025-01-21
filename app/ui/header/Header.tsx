'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const {totalItems, totalPrice } = useCart();
  const { data: session } = useSession();

  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            E-Shop
          </Link>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-circle btn-ghost"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                  <span className="badge indicator-item badge-sm">
                    {totalItems}
                  </span>
                )}
              </div>
            </div>
            <div
              tabIndex={0}
              className="card dropdown-content card-compact z-[1] mt-3 w-52 bg-base-100 shadow"
            >
              <div className="card-body">
                <span className="text-lg font-bold">{totalItems} Items</span>
                <span className="text-info">{totalPrice.toFixed(2)} PLN</span>
                <div className="card-actions">
                  <Link href="/cart" className="btn btn-primary btn-block">
                    View cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar btn btn-circle btn-ghost"
            >
              <div className="w-10 rounded-full">
                <Image
                  alt="User Avatar"
                  src={
                    session?.user?.image ||
                    'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                  }
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              {session ? (
                <>
                  <li>
                    <Link href="/profile" className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings" className="justify-between">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Log Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/signin" className="justify-between">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/signup" className="justify-between">
                      Signup
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
