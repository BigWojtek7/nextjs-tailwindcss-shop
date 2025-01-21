'use client';

import { useCart } from '@/app/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleCheckout() {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending order data:', {
        items,
        total,
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Wystąpił błąd podczas składania zamówienia'
        );
      }

      console.log('Order created successfully:', data);
      clearCart();
      router.push('/profile');
    } catch (error) {
      console.error('Checkout error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd');
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Twój koszyk jest pusty</h2>
          <p className="mt-2 text-gray-600">
            Dodaj produkty do koszyka, aby kontynuować zakupy
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Koszyk</h1>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md"
              >
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <div className="relative h-20 w-20 overflow-hidden rounded">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">{item.price.toFixed(2)} zł</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="rounded-l bg-gray-100 px-3 py-1 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded-r bg-gray-100 px-3 py-1 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Podsumowanie</h2>
          <div className="space-y-2">
            <div className="flex justify-between border-t pt-4">
              <span className="font-semibold">Suma</span>
              <span className="font-semibold">{total.toFixed(2)} zł</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? 'Przetwarzanie...' : 'Przejdź do płatności'}
          </button>
        </div>
      </div>
    </div>
  );
}
