'use client';
import type { Order } from '@prisma/client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AvatarUpload from '../ui/avatar/AvatarUpload';

export default function SettingsPage() {
  const { data: session, update } = useSession();

  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'GET',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || 'Error while fetching orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Data has been updated successfully.');
        setPassword('');
        await update();
      } else {
        setError(data.error || 'Error while updating data');
      }
    } catch (err) {
      setError('An error occurred while updating data');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Order has been deleted.');
        fetchOrders();
      } else {
        setError(data.error || 'Error while deleting order');
      }
    } catch (err) {
      setError('An error occurred while deleting order');
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
          <div className="mb-8 border-b border-gray-700 pb-8">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Your Avatar
            </h2>
            <div className="flex items-center gap-6">
              <AvatarUpload />
              <div className="text-gray-300">
                <p className="text-sm">Maximum file size: 2MB</p>
                <p className="text-sm">Accepted formats: PNG, JPG, WEBP</p>
              </div>
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-white">
            User Settings
          </h2>
          {message && <p className="mb-4 text-green-500">{message}</p>}
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <form onSubmit={handleUpdate} className="mb-8 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 p-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 p-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 p-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="New password (optional)"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {isLoading ? 'Updating...' : 'Update Data'}
              </button>
            </div>
          </form>

          <h2 className="mb-4 text-xl font-semibold text-white">
            Order History
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-300">You don&apos;t have any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg bg-gray-700 p-4 shadow-md"
                >
                  <div className="text-white">
                    <p className="font-medium">Order #{order.id}</p>
                    <p>Status: {order.status}</p>
                    <p>Total amount: ${order.total.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
