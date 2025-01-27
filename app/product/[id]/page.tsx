'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/app/lib/definitions';
import { useCart } from '@/app/context/CartContext';
import { getProduct } from '@/app/lib/data';

const ProductDetails = () => {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const data = await getProduct(id as string);
          setProduct(data);
        } catch (error) {
          console.error('Error while fetching product:', error);
          setProduct(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return <p>Loading product details...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert('Product added to cart!');
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Image src={product.image} alt={product.name} width={500} height={500} />
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-xl">{product.price} PLN</p>
        <p className="mt-4">{product.description}</p>
        <button onClick={handleAddToCart} className="btn btn-primary mt-6">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
