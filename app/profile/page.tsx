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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Profil użytkownika</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Imię:</span> {session.user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {session.user.email}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Wyloguj się
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-xl font-bold">Historia zamówień</h3>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">Brak zamówień w historii</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-2 flex justify-between">
                  <div>
                    <p className="font-medium">
                      Zamówienie #{order.id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Suma: {order.total.toFixed(2)} zł
                    </p>
                    <p
                      className={`text-sm ${
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
                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-t border-gray-100 py-2"
                    >
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <div className="relative h-16 w-16 overflow-hidden rounded">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {item.price.toFixed(2)} zł
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
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
  );
}
