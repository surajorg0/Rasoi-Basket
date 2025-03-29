import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  // Create a new order
  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }

  // Get order by ID
  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Get all orders for the logged-in user
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/myorders`);
  }

  // Get all orders for a seller
  getSellerOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seller`);
  }

  // Get all orders for a delivery agent
  getDeliveryOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/delivery`);
  }

  // Get all orders (admin only)
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Update order to paid
  updateOrderToPaid(id: string, paymentResult: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/pay`, paymentResult);
  }

  // Update order status
  updateOrderStatus(id: string, statusData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, statusData);
  }

  // Assign delivery agent to order
  assignDeliveryAgent(id: string, deliveryAgentId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/assign-delivery`, { deliveryAgentId });
  }
} 