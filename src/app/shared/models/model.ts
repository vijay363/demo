export interface User {
  id?: number;
  email: string;
  password?: string; 
  name: string;
  role?: 'admin' | 'customer';
  avatar?: string;
}
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
currentImageIndex: any;
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
}

export type ThemeMode = 'light' | 'dark' | 'system';
