import Image from 'next/image';

interface OrderItemProps {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export function OrderItem({ name, image, quantity, price }: OrderItemProps) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div className="flex items-center space-x-4">
        {image && (
          <div className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
        )}
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="mt-1 text-sm text-gray-300">
            {quantity} x {price.toFixed(2)} zł
          </p>
        </div>
      </div>
      <p className="font-medium text-white">
        {(quantity * price).toFixed(2)} zł
      </p>
    </div>
  );
}
