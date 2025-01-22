import { Product } from './definitions';

const API_URL = 'https://fakestoreapi.com';

// Poprawiony interfejs - API fakestore zwraca ID jako number
interface ApiProduct {
  id: number; // Zmiana z string na number
  title: string;
  price: number;
  image: string;
  description: string;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);
  const data: ApiProduct[] = await response.json(); // Dodaj explicite typowanie

  return data.map((item) => ({
    id: String(item.id), // Konwersja number -> string
    name: item.title,
    price: item.price,
    image: item.image,
    description: item.description,
  }));
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);
  const item: ApiProduct = await response.json(); // Dodaj typowanie

  return {
    id: String(item.id), // Konwersja number -> string
    name: item.title,
    price: item.price,
    image: item.image,
    description: item.description,
  };
}