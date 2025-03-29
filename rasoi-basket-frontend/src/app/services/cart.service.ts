import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface CartItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private useMockData = true; // Set to false when connecting to real backend
  
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  private readonly CART_STORAGE_KEY = 'rasoi_basket_cart';
  private sellerId: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadCartFromStorage();
  }

  // Load cart from local storage on service initialization
  private loadCartFromStorage(): void {
    const cartDataStr = localStorage.getItem(this.CART_STORAGE_KEY);
    if (cartDataStr) {
      try {
        const cartData = JSON.parse(cartDataStr);
        this.cartItemsSubject.next(cartData);
      } catch (e) {
        console.error('Error parsing cart data from local storage', e);
        this.cartItemsSubject.next([]);
      }
    } else {
      this.cartItemsSubject.next([]);
    }
  }

  // Save cart to local storage
  private saveCartToStorage(): void {
    localStorage.setItem(
      this.CART_STORAGE_KEY,
      JSON.stringify(this.cartItemsSubject.value)
    );
  }

  // Get cart items
  getCartItems(): Observable<CartItem[]> {
    if (this.useMockData) {
      return this.cartItems$;
    }
    
    if (!this.authService.isAuthenticated()) {
      return of([]);
    }
    
    return this.http.get<CartItem[]>(`${this.apiUrl}/items`);
  }

  // Get cart item count
  getCartItemsCount(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  // Get cart total
  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.quantity * item.product.finalPrice),
      0
    );
  }

  // Add item to cart
  addToCart(product: any, quantity: number = 1): boolean {
    if (!product) return false;
    
    const currentItems = [...this.cartItemsSubject.value];
    
    // Check if product is from a different seller
    if (currentItems.length > 0) {
      const firstProduct = currentItems[0].product;
      if (firstProduct.seller._id !== product.seller._id) {
        console.warn('Cannot add products from different sellers to the cart.');
        return false;
      }
    }
    
    // Check if product is already in cart
    const existingItemIndex = currentItems.findIndex(
      item => item.product._id === product._id
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if product doesn't exist in cart
      currentItems.push({
        product: product,
        quantity: quantity
      });
      
      // Set seller ID if this is the first item
      if (currentItems.length === 1) {
        this.sellerId = product.seller._id;
      }
    }
    
    // Update cart
    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage();
    
    return true;
  }

  // Update cart item quantity
  updateItemQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const currentItems = [...this.cartItemsSubject.value];
    const existingItemIndex = currentItems.findIndex(
      item => item.product._id === productId
    );
    
    if (existingItemIndex >= 0) {
      currentItems[existingItemIndex].quantity = quantity;
      this.cartItemsSubject.next(currentItems);
      this.saveCartToStorage();
    }
  }

  // Remove item from cart
  removeFromCart(productId: string): void {
    const filteredItems = this.cartItemsSubject.value.filter(
      item => item.product._id !== productId
    );
    
    this.cartItemsSubject.next(filteredItems);
    
    // Reset seller ID if cart is empty
    if (filteredItems.length === 0) {
      this.sellerId = null;
    }
    
    this.saveCartToStorage();
  }

  // Clear cart
  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.sellerId = null;
    this.saveCartToStorage();
  }

  // Checkout
  checkout(orderData: any): Observable<any> {
    if (this.useMockData) {
      // Return mock checkout response
      this.clearCart();
      return of({ 
        success: true, 
        message: 'Order placed successfully', 
        orderId: 'mock-order-' + Date.now() 
      });
    }
    
    return this.http.post<any>(`${this.apiUrl}/checkout`, orderData);
  }

  getCurrentSellerId(): string | null {
    return this.sellerId;
  }
} 