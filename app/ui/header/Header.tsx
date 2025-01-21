'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { items, totalItems, totalPrice } = useCart();
  const { data: session } = useSession();

//   <header className="bg-white shadow">
//   <nav className="container mx-auto flex items-center justify-between p-4">
//     <Link href="/" className="text-xl font-bold">
//       E-Shop
//     </Link>

//     <div className="flex items-center space-x-4">
//       <Link href="/products" className="text-gray-600 hover:text-gray-900">
//         Produkty
//       </Link>

//       {session ? (
//         <>
//           <Link
//             href="/profile"
//             className="text-gray-600 hover:text-gray-900"
//           >
//             Profil
//           </Link>
//           <button
//             onClick={() => signOut()}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             Wyloguj
//           </button>
//         </>
//       ) : (
//         <Link
//           href="/auth/signin"
//           className="text-gray-600 hover:text-gray-900"
//         >
//           Zaloguj
//         </Link>
//       )}

//       <Link href="/cart" className="relative">
//         <div className="indicator">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//             />
//           </svg>
//           {totalItems > 0 && (
//             <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
//               {totalItems}
//             </span>
//           )}
//         </div>
//       </Link>
//     </div>
//   </nav>
// </header>

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
                <span className="badge indicator-item badge-sm">
                  {totalItems}
                </span>
              </div>
            </div>
            <div
              tabIndex={0}
              className="card dropdown-content card-compact z-[1] mt-3 w-52 bg-base-100 shadow"
            >
              <div className="card-body">
                <span className="text-lg font-bold">{totalItems} Items</span>
                <span className="text-info">{totalPrice} PLN </span>
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
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <Link href="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
              <button
            onClick={() => signOut()}
            className="text-gray-700 hover:text-gray-900"
          >
            Log Out
          </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
