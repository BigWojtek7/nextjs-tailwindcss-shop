'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An unexpected error occurred';

  switch (error) {
    case 'CredentialsSignin':
      errorMessage = 'Invalid email or password';
      break;
    case 'AccessDenied':
      errorMessage = 'Access denied';
      break;
    case 'Verification':
      errorMessage = 'Verification link has expired or is invalid';
      break;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-red-600">
            Login Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/auth/signin"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to login page
          </Link>
        </div>
      </div>
    </div>
  );
}
