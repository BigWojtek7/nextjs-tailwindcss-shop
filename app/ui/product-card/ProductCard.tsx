// 'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/app/lib/definitions';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={100}
          className="object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
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
