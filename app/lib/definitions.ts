export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface OrderData {
  items: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}


export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
}


// @/app/profile/page

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  error?: string;
}