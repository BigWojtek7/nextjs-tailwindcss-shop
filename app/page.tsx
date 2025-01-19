'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ui/product-card/ProductCard';
import { Product } from '@/app/lib/definitions';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Mock API fetch
    const fetchProducts = async () => {
      // Przykładowe dane
      const data: Product[] = [
        {
          id: 1,
          name: 'Produkt 1',
          price: 100,
          image: '/images/product1.jpg',
          description: 'Opis produktu 1',
        },
        {
          id: 2,
          name: 'Produkt 2',
          price: 200,
          image: '/images/product2.jpg',
          description: 'Opis produktu 2',
        },
        // Dodaj więcej produktów według potrzeb
      ];
      // Symulacja opóźnienia
      setTimeout(() => {
        setProducts(data);
        setIsLoading(false);
      }, 1000);
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <p>Ładowanie produktów...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Home;
