'use client';

import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';

const CartPage = () => {
  const { cartItems, removeFromCart, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return <p>Koszyk jest pusty.</p>;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Twój Koszyk</h1>
      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <Image src={item.image} alt={item.name} width={100} height={100} />
            <div className="flex-1">
              <h2 className="text-xl">{item.name}</h2>
              <p>{item.price} PLN</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="btn btn-error"
            >
              Usuń
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <h2 className="text-xl font-semibold">Razem: {totalPrice} PLN</h2>
        <button className="btn btn-success mt-4">Przejdź do Płatności</button>
      </div>
    </div>
  );
};

export default CartPage;
