import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/location`;
  private useMockData = true; // Set to false when connecting to real backend

  constructor(private http: HttpClient) { }

  // Get current location
  getCurrentLocation(): Observable<any> {
    if (this.useMockData) {
      // Return mock location data
      return of({
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'New Delhi, India'
      });
    }
    
    return new Observable((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not supported by this browser.');
      }
    });
  }

  // Get address from coordinates (geocoding)
  getAddressFromCoords(lat: number, lng: number): Observable<any> {
    if (this.useMockData) {
      // Return mock address data
      return of({
        address: 'New Delhi, India',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110001'
      });
    }
    return this.http.get<any>(`${this.apiUrl}/geocode?lat=${lat}&lng=${lng}`);
  }

  // Save user's delivery address
  saveAddress(addressData: any): Observable<any> {
    if (this.useMockData) {
      // Return mock success response
      return of({ success: true, message: 'Address saved successfully' });
    }
    return this.http.post<any>(`${this.apiUrl}/address`, addressData);
  }

  // Get saved addresses for the current user
  getSavedAddresses(): Observable<any[]> {
    if (this.useMockData) {
      // Return mock addresses
      return of([
        {
          id: '1',
          name: 'Home',
          address: '123 Main Street',
          city: 'New Delhi',
          state: 'Delhi',
          postalCode: '110001',
          isDefault: true
        },
        {
          id: '2',
          name: 'Work',
          address: '456 Business Park',
          city: 'Gurgaon',
          state: 'Haryana',
          postalCode: '122001',
          isDefault: false
        }
      ]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/addresses`);
  }
} 