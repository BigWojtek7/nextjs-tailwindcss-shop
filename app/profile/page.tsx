'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OrderStatus } from '../ui/profile/OrderStatus';
import { OrderItem } from '../ui/profile/OrderItem';
import { LoadingSpinner } from '../ui/profile/LoadingSpinner';
import { ProfileContainer } from '../ui/profile/ProfileContainer';

import type { Order } from '@/app/lib/definitions';
import type { OrdersResponse } from '@/app/lib/definitions';
import { ProfileHeader } from '@/app/ui/profile/ProfileHeader';
import { ProfileDetails } from '@/app//ui/profile/ProfileDetails';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(session?.user);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Error while fetching orders');
        const data: OrdersResponse = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.error || 'Unknown error while fetching orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('An error occurred while fetching orders');
      }finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  if (status === 'loading' || isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <ProfileContainer>
      <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <ProfileHeader onSignOut={() => signOut({ callbackUrl: '/' })} />
          <ProfileDetails
            name={session.user.name || 'No data'}
            email={session.user.email}
          />
        </div>
      </div>
      <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold text-white">Order History</h3>
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-300">No orders in history</p>
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
                        Order #{order.id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString(
                          'en-EN',
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
                        Total: {order.total.toFixed(2)} zł
                      </p>
                      <OrderStatus status={order.status} />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 p-4">
                  {order.items.map((item) => (
                    <OrderItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image={item.image || '/default-product-image.jpg'}
                      quantity={item.quantity}
                      price={item.price}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileContainer>
  );
}
