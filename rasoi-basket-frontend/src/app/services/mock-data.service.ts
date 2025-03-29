import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private products = [
    {
      _id: '1',
      name: 'Fresh Tomatoes',
      description: 'Fresh, ripe tomatoes from local farms',
      price: 40,
      finalPrice: 30,
      discountPercentage: 25,
      unit: 'kg',
      image: 'assets/images/placeholder.svg',
      category: 'vegetables',
      isAvailable: true,
      inStock: 100,
      seller: {
        _id: 'seller1',
        name: 'Farm Fresh'
      }
    },
    {
      _id: '2',
      name: 'Green Spinach',
      description: 'Fresh, organic spinach leaves',
      price: 30,
      finalPrice: 30,
      discountPercentage: 0,
      unit: 'bunch',
      image: 'assets/images/placeholder.svg',
      category: 'vegetables',
      isAvailable: true,
      inStock: 50,
      seller: {
        _id: 'seller1',
        name: 'Farm Fresh'
      }
    },
    {
      _id: '3',
      name: 'Bananas',
      description: 'Ripe yellow bananas',
      price: 60,
      finalPrice: 48,
      discountPercentage: 20,
      unit: 'dozen',
      image: 'assets/images/placeholder.svg',
      category: 'fruits',
      isAvailable: true,
      inStock: 75,
      seller: {
        _id: 'seller2',
        name: 'Fruit Paradise'
      }
    },
    {
      _id: '4',
      name: 'Basmati Rice',
      description: 'Premium long grain basmati rice',
      price: 120,
      finalPrice: 120,
      discountPercentage: 0,
      unit: 'kg',
      image: 'assets/images/placeholder.svg',
      category: 'groceries',
      isAvailable: true,
      inStock: 200,
      seller: {
        _id: 'seller3',
        name: 'Grocery World'
      }
    }
  ];

  constructor() { }

  getProducts(category?: string, search?: string): Observable<any[]> {
    let filteredProducts = [...this.products];
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (search && search.trim() !== '') {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return of(filteredProducts);
  }

  getProductById(id: string): Observable<any> {
    const product = this.products.find(p => p._id === id);
    return of(product || null);
  }
} 