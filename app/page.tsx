'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ui/product-card/ProductCard';
import { Product } from '@/app/lib/definitions';
import { getProducts } from '@/app/lib/data';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibleProducts, setVisibleProducts] = useState(9);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 9);
  };

  const productsToShow = products.slice(0, visibleProducts);

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {productsToShow.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.length > visibleProducts && (
        <button onClick={loadMore} className="btn btn-secondary mt-4">
          Więcej
        </button>
      )}
    </div>
  );
}
