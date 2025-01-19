'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/app/lib/definitions';
import { useCart } from '@/app/context/CartContext';

const ProductDetails = () => {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      // Mock API fetch dla konkretnego produktu
      const fetchProduct = async () => {
        // Przykładowe dane
        const data: Product = {
          id: Number(id),
          name: `Produkt ${id}`,
          price: 100 * Number(id),
          image: `/images/product${id}.jpg`,
          description: `Opis produktu ${id}`,
        };
        // Symulacja opóźnienia
        setTimeout(() => {
          setProduct(data);
          setIsLoading(false);
        }, 1000);
      };

      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return <p>Ładowanie szczegółów produktu...</p>;
  }

  if (!product) {
    return <p>Produkt nie został znaleziony.</p>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert('Produkt dodany do koszyka!');
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Image src={product.image} alt={product.name} width={500} height={500} />
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-xl">{product.price} PLN</p>
        <p className="mt-4">{product.description}</p>
        <button onClick={handleAddToCart} className="btn btn-primary mt-6">
          Dodaj do Koszyka
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
