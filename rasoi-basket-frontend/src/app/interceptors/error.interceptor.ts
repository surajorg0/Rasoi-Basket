import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 0) {
            // Connection refused - likely the server is not running
            console.warn('Connection to server refused. Using mock data instead.');
            
            // Here, we're just constructing a meaningful error message
            // In a production app, you might try to switch to offline mode
            errorMessage = 'Could not connect to server. Please check your connection or try again later.';
            
            // Optionally, you could redirect to a "Server Unavailable" page
            // this.router.navigate(['/server-unavailable']);
          } else if (error.status === 401) {
            // Auto logout if 401 Unauthorized is returned from API
            this.authService.logout();
            errorMessage = 'Your session has expired. Please log in again.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
        }
        
        // Log the error to console for debugging
        console.error('HTTP Error:', errorMessage);
        
        // Return the error for further handling
        return throwError(() => error);
      })
    );
  }
} 