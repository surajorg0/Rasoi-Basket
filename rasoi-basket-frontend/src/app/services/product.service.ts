import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private useMockData = false; // Set to false to use real MongoDB backend

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) { }

  // Get all products
  getProducts(category?: string, search?: string): Observable<any[]> {
    if (this.useMockData) {
      return this.mockDataService.getProducts(category, search);
    }
    
    let url = this.apiUrl;
    
    // Add query parameters for filtering
    if (category || search) {
      url += '?';
      if (category) {
        url += `category=${category}`;
      }
      if (search) {
        url += category ? `&search=${search}` : `search=${search}`;
      }
    }
    
    return this.http.get<any[]>(url);
  }

  // Get a single product by ID
  getProductById(id: string): Observable<any> {
    if (this.useMockData) {
      return this.mockDataService.getProductById(id);
    }
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create a new product (for sellers)
  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData);
  }

  // Update an existing product (for sellers)
  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, productData);
  }

  // Delete a product (for sellers)
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Get all products for a seller
  getSellerProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seller/products`);
  }
} 