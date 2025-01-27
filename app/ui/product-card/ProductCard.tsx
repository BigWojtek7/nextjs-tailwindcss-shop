// 'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/app/lib/definitions';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="relative h-[200px] w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name.length > 20
            ? `${product.name.slice(0, 20)}...`
            : product.name}
        </h2>
        <p>{product.price} PLN</p>
        <div className="card-actions justify-end">
          <Link href={`/product/${product.id}`} className="btn btn-primary">
            Zobacz Szczegóły
          </Link>
        </div>
      </div>
    </div>
  );
}
