'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ui/product-card/ProductCard';
import { Product } from '@/app/lib/definitions';
import { getProducts } from '@/app/lib/data';
import Button from '@/app/ui/button/Button';

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
        console.error('Error while fetching products:', error);
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
        <Button onClick={loadMore} className="btn btn-secondary mt-4">
          More
        </Button>
      )}
    </div>
  );
}
