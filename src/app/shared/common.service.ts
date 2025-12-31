import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { CacheService } from '../core/cache/cache.service';
import { Category, Product } from './model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private baseUrl = environment.apiUrl;
  cacheService = inject(CacheService);

  constructor(private http: HttpClient) {}
  
  getProducts(page: number, limit: number) {
    const offset = page * limit;
    return this.http.get<Product[]>(
      `${this.baseUrl}/products?offset=${offset}&limit=${limit}`
    );
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  getProductBySlug(slug: string) {
    return this.http.get<Product>(`${this.baseUrl}/products/slug/${slug}`);
  }

  getRelatedProducts(id: number) {
    return this.http.get<Product[]>(`${this.baseUrl}/products/${id}/related`);
  }
  getCategories() {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  createProduct(data: {
    title: string;
    price: number;
    description: string;
    categoryId: number;
    images: string[];
  }) {
    return this.http.post<Product>(`${this.baseUrl}/products`, data);
  }

  updateProduct(id: number, data: Partial<Product> & { categoryId?: number }) {
    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, data);
  }

  deleteProduct(id: number) {
    return this.http.delete<boolean>(`${this.baseUrl}/products/${id}`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, data);
  }
  clearCache() {
    this.cacheService.clear();
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
  createUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/`, data);
  }
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(
      'https://api.escuelajs.co/api/v1/files/upload',
      formData
    );
  }
  getProductsFiltered(params: {
    title?: string;
    categoryId?: number | null;
    priceMin?: number | null;
    priceMax?: number | null;
    page: number;
    limit: number;
  }) {
    const offset = params.page * params.limit;

    return this.http.get<Product[]>(`${this.baseUrl}/products`, {
      params: {
        title: params.title ?? '',
        categoryId: params.categoryId ?? '',
        price_min: params.priceMin ?? '',
        price_max: params.priceMax ?? '',
        offset,
        limit: params.limit,
      },
    });
  }
}
