import { Product } from './definitions';

const API_URL = 'https://fakestoreapi.com';

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);
  const data = await response.json();

  return data.map((item: any) => ({
    id: item.id,
    name: item.title,
    price: item.price,
    image: item.image,
    description: item.description,
  }));
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);
  const item = await response.json();

  return {
    id: item.id,
    name: item.title,
    price: item.price,
    image: item.image,
    description: item.description,
  };
}
