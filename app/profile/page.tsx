'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Ładowanie...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Profil użytkownika
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-white p-4 shadow-sm">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Imię</p>
                <p className="mt-1 text-sm text-gray-900">
                  {session.user.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-sm text-gray-900">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Wyloguj się
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
