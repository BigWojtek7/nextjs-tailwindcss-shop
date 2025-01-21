'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
  error?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Błąd podczas pobierania zamówień');
        const data: OrdersResponse = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.error || 'Nieznany błąd podczas pobierania zamówień');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Wystąpił błąd podczas pobierania zamówień');
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  if (status === 'loading' || isLoading) {
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
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Profil użytkownika
          </h2>
          <div className="space-y-2 text-gray-300">
            <p>
              <span className="font-semibold text-white">Imię:</span>{' '}
              {session.user.name}
            </p>
            <p>
              <span className="font-semibold text-white">Email:</span>{' '}
              {session.user.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Wyloguj się
          </button>
        </div>

        <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
          <h3 className="mb-6 text-xl font-bold text-white">
            Historia zamówień
          </h3>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-300">Brak zamówień w historii</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-gray-700 shadow-sm"
                >
                  <div className="border-b border-gray-200 bg-gray-600 p-4">
                    <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0">
                      <div>
                        <p className="font-semibold text-white">
                          Zamówienie #{order.id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString(
                            'pl-PL',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          Suma: {order.total.toFixed(2)} zł
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            order.status === 'COMPLETED'
                              ? 'text-green-600'
                              : order.status === 'CANCELLED'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                          }`}
                        >
                          {order.status === 'COMPLETED'
                            ? 'Zrealizowane'
                            : order.status === 'CANCELLED'
                              ? 'Anulowane'
                              : 'W trakcie realizacji'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200 p-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center space-x-4">
                          {item.image && (
                            <div className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-300">
                              {item.quantity} x {item.price.toFixed(2)} zł
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-white">
                          {(item.quantity * item.price).toFixed(2)} zł
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
