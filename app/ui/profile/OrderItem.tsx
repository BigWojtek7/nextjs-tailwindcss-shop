import Image from 'next/image';

interface OrderItemProps {
  id: string;
  name: string;
  image: string;
}

export function OrderItem({ name, image }: OrderItemProps) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div className="flex items-center space-x-4">
        {image && (
          <div className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
