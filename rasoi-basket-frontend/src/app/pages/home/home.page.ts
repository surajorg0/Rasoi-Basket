import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, FormsModule]
})
export class HomePage implements OnInit {
  // Products data
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  
  // UI control variables
  isLoading = true;
  error: string | null = null;
  selectedCategory = 'all';
  searchTerm = '';
  cartItemCount = 0;
  
  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // If user is not authorized to access normal user pages, redirect them
    if (this.authService.isAuthenticated() && !this.authService.isUser()) {
      this.redirectBasedOnRole();
      return;
    }
    
    // Load products
    this.loadProducts();
    
    // Subscribe to cart updates to show cart badge
    this.cartService.cartItems$.subscribe((items: any[]) => {
      this.cartItemCount = items.reduce((count: number, item: any) => count + item.quantity, 0);
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again.';
        this.isLoading = false;
      }
    });
  }

  segmentChanged() {
    this.applyFilters();
  }

  searchProducts() {
    this.applyFilters();
  }

  applyFilters() {
    // Start with all products
    let filtered = [...this.allProducts];
    
    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category === this.selectedCategory
      );
    }
    
    // Apply search filter if a search term exists
    if (this.searchTerm?.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term)
      );
    }
    
    this.filteredProducts = filtered;
  }

  addToCart(event: Event, product: any) {
    // Stop event propagation to prevent navigation to product details
    event.stopPropagation();
    
    if (!product.isAvailable || product.inStock <= 0) {
      return;
    }
    
    const added = this.cartService.addToCart(product, 1);
    
    if (added) {
      this.presentToast(`${product.name} added to cart`);
    } else {
      this.presentToast('Cannot add items from different sellers to the same cart', 'warning');
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
  
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  private redirectBasedOnRole(): void {
    const role = this.authService.getUserRole();
    
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'seller':
        this.router.navigate(['/seller-dashboard']);
        break;
      case 'delivery':
        this.router.navigate(['/delivery-dashboard']);
        break;
      // Default case (user) is already handled by staying on this page
    }
  }
} 