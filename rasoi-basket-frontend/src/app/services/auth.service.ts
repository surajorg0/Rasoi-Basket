import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, from, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Mock JWT token (this is just for demonstration, not a real JWT)
const MOCK_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isApproved: boolean;
  status: string;
  sellerInfo?: {
    storeName?: string;
    storeAddress?: string;
    businessRegNumber?: string;
  };
  deliveryInfo?: {
    vehicleType?: string;
    licenseNumber?: string;
    area?: string[];
  };
  profileImage?: string;
  darkMode?: boolean;
  language?: string;
  dateJoined?: Date;
  lastLogin?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private jwtHelper = new JwtHelperService();
  private useMockData = false; // Set to false to connect to real backend

  // Mock user data
  private mockUsers: User[] = [
    {
      _id: '1',
      name: 'Suraj Admin',
      email: 'suraj@admin.com',
      phone: '9876543210',
      role: 'admin',
      isApproved: true,
      status: 'active',
      profileImage: 'assets/images/admin-profile.jpg',
      darkMode: false,
      language: 'en',
      dateJoined: new Date('2023-01-01'),
      lastLogin: new Date()
    },
    {
      _id: '2',
      name: 'Suraj User',
      email: 'suraj@user.com',
      phone: '9876543211',
      role: 'user',
      isApproved: true,
      status: 'active',
      profileImage: 'assets/images/user-profile.jpg',
      darkMode: true,
      language: 'en',
      dateJoined: new Date('2023-02-15'),
      lastLogin: new Date()
    },
    {
      _id: '3',
      name: 'Suraj Seller',
      email: 'suraj@seller.com',
      phone: '9876543212',
      role: 'seller',
      isApproved: true,
      status: 'active',
      sellerInfo: {
        storeName: 'Suraj\'s Restaurant',
        storeAddress: '123 Main Street, Mumbai',
        businessRegNumber: 'B123456'
      },
      profileImage: 'assets/images/seller-profile.jpg',
      darkMode: false,
      language: 'en',
      dateJoined: new Date('2023-03-10'),
      lastLogin: new Date()
    },
    {
      _id: '4',
      name: 'Suraj Delivery',
      email: 'suraj@delivery.com',
      phone: '9876543213',
      role: 'delivery',
      isApproved: true,
      status: 'active',
      deliveryInfo: {
        vehicleType: 'Motorcycle',
        licenseNumber: 'DL123456',
        area: ['South Mumbai', 'Andheri', 'Bandra']
      },
      profileImage: 'assets/images/delivery-profile.jpg',
      darkMode: true,
      language: 'en',
      dateJoined: new Date('2023-04-05'),
      lastLogin: new Date()
    },
    {
      _id: '5',
      name: 'Pending Seller',
      email: 'pending@seller.com',
      phone: '9876543214',
      role: 'seller',
      isApproved: false,
      status: 'pending',
      sellerInfo: {
        storeName: 'New Food Store',
        storeAddress: '456 Market Road, Delhi',
        businessRegNumber: 'B789012'
      },
      dateJoined: new Date('2023-05-20')
    },
    {
      _id: '6',
      name: 'Pending Delivery',
      email: 'pending@delivery.com',
      phone: '9876543215',
      role: 'delivery',
      isApproved: false,
      status: 'pending',
      deliveryInfo: {
        vehicleType: 'Scooter',
        licenseNumber: 'DL654321',
        area: ['East Delhi', 'Noida']
      },
      dateJoined: new Date('2023-06-15')
    }
  ];

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    if (this.useMockData) {
      // For simplicity in demo, we're using a hardcoded password
      const mockPassword = '12345';
      
      // Find user in mock data
      const user = this.mockUsers.find(u => u.email === email);
      
      if (user && password === mockPassword) {
        // Only allow login for approved users
        if (!user.isApproved) {
          return new Observable(observer => {
            observer.error({ 
              error: { 
                message: 'Your account is pending approval. Please wait for admin confirmation or contact support.' 
              } 
            });
          });
        }
        
        if (user.status !== 'active') {
          return new Observable(observer => {
            observer.error({ 
              error: { 
                message: `Your account is currently ${user.status}. Please contact support for assistance.` 
              } 
            });
          });
        }
        
        // Create response with token and user data
        const response = {
          ...user,
          token: MOCK_JWT,
          lastLogin: new Date()
        };
        
        // Store user data and token
        this.storeUserData(response);
        this.currentUserSubject.next(response);
        
        return of(response);
      } else {
        // Return error for invalid credentials
        return new Observable(observer => {
          observer.error({ error: { message: 'Invalid email or password' } });
        });
      }
    }
    
    // Create HTTP headers
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const userData = { email, password };
    
    // Try login-test endpoint first (most reliable)
    return this.http.post<any>(`${environment.apiUrl}/users/login-test`, userData, { headers })
      .pipe(
        tap(response => {
          console.log('Login successful with login-test endpoint:', response);
          this.storeUserData(response);
          this.currentUserSubject.next(response);
        }),
        catchError(error => {
          console.error('Login-test error:', error);
          
          // If login-test fails, try the direct-login endpoint
          console.log('Trying direct-login endpoint...');
          return this.http.post<any>(`${environment.apiUrl}/direct-login`, userData, { headers })
            .pipe(
              tap(response => {
                console.log('Direct login successful:', response);
                this.storeUserData(response);
                this.currentUserSubject.next(response);
              }),
              catchError(directLoginError => {
                console.error('Direct login error:', directLoginError);
                
                // Finally, try the regular login endpoint
                console.log('Trying regular login endpoint...');
                return this.http.post<any>(`${environment.apiUrl}/users/login`, userData, { headers })
                  .pipe(
                    tap(response => {
                      console.log('Regular login successful:', response);
                      this.storeUserData(response);
                      this.currentUserSubject.next(response);
                    }),
                    catchError(regularLoginError => {
                      console.error('All login attempts failed:', regularLoginError);
                      
                      // If all login attempts fail and we have a "stream is not readable" error,
                      // provide a more helpful error message
                      if (regularLoginError.error && regularLoginError.error.message === 'stream is not readable') {
                        return throwError(() => ({ 
                          error: { 
                            message: 'Server communication error. Please try again or contact support.' 
                          } 
                        }));
                      }
                      
                      return throwError(() => regularLoginError);
                    })
                  );
              })
            );
        })
      );
  }

  register(userData: any): Observable<any> {
    if (this.useMockData) {
      // Check if email already exists
      if (this.mockUsers.some(u => u.email === userData.email)) {
        return new Observable(observer => {
          observer.error({ error: { message: 'Email already in use' } });
        });
      }
      
      // Create new user with properly formatted data
      const newUser: User = {
        ...userData,
        _id: (this.mockUsers.length + 1).toString(),
        dateJoined: new Date(),
        lastLogin: userData.isApproved ? new Date() : undefined
      };

      // Ensure area is properly formatted for delivery users
      if (userData.role === 'delivery' && userData.deliveryInfo && typeof userData.deliveryInfo.area === 'string') {
        newUser.deliveryInfo = {
          ...userData.deliveryInfo,
          area: userData.deliveryInfo.area.split(',').map((item: string) => item.trim())
        };
      }
      
      // Create response object
      const response = {
        ...newUser,
        token: userData.isApproved ? MOCK_JWT : undefined
      };
      
      // Add to mock users
      this.mockUsers.push(newUser);
      
      // Only store user data if approved (e.g., regular users)
      if (userData.isApproved) {
        this.storeUserData(response);
        this.currentUserSubject.next(newUser);
      }
      
      console.log('User registered successfully:', newUser);
      console.log('Current mock users:', this.mockUsers);
      
      return of(response);
    }
    
    return this.http.post<any>(`${environment.apiUrl}/users/register`, userData)
      .pipe(
        tap(response => {
          // Store user and token in local storage only if auto-approved
          if (response.isApproved) {
            this.storeUserData(response);
            this.currentUserSubject.next(response);
          }
        }),
        catchError(error => {
          console.error('Registration error:', error);
          throw error;
        })
      );
  }

  logout() {
    // Remove user from local storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private storeUserData(userData: any) {
    localStorage.setItem(TOKEN_KEY, userData.token);
    const userToStore = { ...userData };
    delete userToStore.token; // Don't store token in user data object
    delete userToStore.password; // Don't store password
    localStorage.setItem(USER_KEY, JSON.stringify(userToStore));
  }

  getStoredUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    // For demo purposes, just check if token exists
    if (this.useMockData) {
      return this.getToken() !== null;
    }
    
    // For real implementation, verify token is not expired
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isSeller(): boolean {
    return this.getUserRole() === 'seller';
  }

  isDelivery(): boolean {
    return this.getUserRole() === 'delivery';
  }

  isUser(): boolean {
    return this.getUserRole() === 'user';
  }

  // Admin functions for managing users
  getAllUsers(): Observable<User[]> {
    if (this.useMockData) {
      return of(this.mockUsers);
    }
    
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getPendingApprovals(): Observable<User[]> {
    if (this.useMockData) {
      return of(this.mockUsers.filter(user => !user.isApproved && user.status === 'pending'));
    }
    
    return this.http.get<User[]>(`${environment.apiUrl}/users/pending`);
  }

  approveUser(userId: string): Observable<any> {
    if (this.useMockData) {
      const userIndex = this.mockUsers.findIndex(u => u._id === userId);
      
      if (userIndex >= 0) {
        this.mockUsers[userIndex].isApproved = true;
        this.mockUsers[userIndex].status = 'active';
        return of({ success: true, user: this.mockUsers[userIndex] });
      }
      
      return new Observable(observer => {
        observer.error({ error: { message: 'User not found' } });
      });
    }
    
    return this.http.put<any>(`${environment.apiUrl}/users/${userId}/approve`, {});
  }

  rejectUser(userId: string, reason: string): Observable<any> {
    if (this.useMockData) {
      const userIndex = this.mockUsers.findIndex(u => u._id === userId);
      
      if (userIndex >= 0) {
        this.mockUsers[userIndex].status = 'rejected';
        return of({ success: true, user: this.mockUsers[userIndex] });
      }
      
      return new Observable(observer => {
        observer.error({ error: { message: 'User not found' } });
      });
    }
    
    return this.http.put<any>(`${environment.apiUrl}/users/${userId}/reject`, { reason });
  }

  updateUserStatus(userId: string, status: string): Observable<any> {
    if (this.useMockData) {
      const userIndex = this.mockUsers.findIndex(u => u._id === userId);
      
      if (userIndex >= 0) {
        this.mockUsers[userIndex].status = status;
        return of({ success: true, user: this.mockUsers[userIndex] });
      }
      
      return new Observable(observer => {
        observer.error({ error: { message: 'User not found' } });
      });
    }
    
    return this.http.put<any>(`${environment.apiUrl}/users/${userId}`, { status });
  }

  resetUserPassword(userId: string): Observable<any> {
    if (this.useMockData) {
      const userIndex = this.mockUsers.findIndex(u => u._id === userId);
      
      if (userIndex >= 0) {
        // In mock mode, we just return success
        return of({ 
          success: true, 
          message: 'Password reset email sent to user.'
        });
      }
      
      return new Observable(observer => {
        observer.error({ error: { message: 'User not found' } });
      });
    }
    
    return this.http.post<any>(`${environment.apiUrl}/users/${userId}/reset-password`, {});
  }

  updateProfile(userData: any): Observable<any> {
    if (this.useMockData) {
      // Update current user data
      const currentUser = this.currentUserValue;
      
      if (!currentUser) {
        return new Observable(observer => {
          observer.error({ error: { message: 'Not authenticated' } });
        });
      }
      
      const updatedUser = { ...currentUser, ...userData };
      
      // Update mock users array
      const userIndex = this.mockUsers.findIndex(u => u._id === currentUser._id);
      if (userIndex >= 0) {
        this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...userData };
      }
      
      // Update stored user
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
      
      return of(updatedUser);
    }
    
    return this.http.put<any>(`${environment.apiUrl}/users/profile`, userData)
      .pipe(
        tap(response => {
          // Update stored user data
          const updatedUser = { ...this.getStoredUser(), ...response };
          localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    if (this.useMockData) {
      // For mock data, just return success
      return of({ success: true, message: 'Password changed successfully' });
    }
    
    return this.http.put<any>(`${environment.apiUrl}/users/change-password`, {
      currentPassword,
      newPassword
    });
  }

  updateSettings(settings: any): Observable<any> {
    if (this.useMockData) {
      // Update current user settings
      const currentUser = this.currentUserValue;
      
      if (!currentUser) {
        return new Observable(observer => {
          observer.error({ error: { message: 'Not authenticated' } });
        });
      }
      
      const updatedUser = { ...currentUser, ...settings };
      
      // Update mock users array
      const userIndex = this.mockUsers.findIndex(u => u._id === currentUser._id);
      if (userIndex >= 0) {
        this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...settings };
      }
      
      // Update stored user
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
      
      return of(updatedUser);
    }
    
    return this.http.put<any>(`${environment.apiUrl}/users/settings`, settings)
      .pipe(
        tap(response => {
          // Update stored user data
          const updatedUser = { ...this.getStoredUser(), ...response };
          localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        })
      );
  }
} 