import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { LocationService } from '../../services/location.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CategoryFilterComponent } from '../../components/category-filter/category-filter.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { addIcons } from 'ionicons';
import { 
  locationOutline, 
  locateOutline, 
  basketOutline, 
  alertCircleOutline
} from 'ionicons/icons';
import { 
  IonContent, 
  IonRefresher, 
  IonRefresherContent, 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonButton,
  IonSearchbar,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    CategoryFilterComponent,
    ProductCardComponent,
    IonContent, 
    IonRefresher, 
    IonRefresherContent, 
    IonItem, 
    IonIcon, 
    IonLabel, 
    IonButton,
    IonSearchbar,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class MainPage implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = 'all';
  searchTerm: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  currentLocation: string = '';

  constructor(
    private productService: ProductService,
    private locationService: LocationService,
    private router: Router
  ) {
    addIcons({ 
      locationOutline, 
      locateOutline, 
      basketOutline, 
      alertCircleOutline
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.getCurrentLocation();
  }

  loadProducts() {
    this.isLoading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.error = 'Failed to load products. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  searchProducts() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];
    
    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }
    
    // Apply search filter
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term)
      );
    }
    
    this.filteredProducts = filtered;
  }

  handleRefresh(event: any) {
    this.loadProducts();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  viewProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }

  getCurrentLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (coords) => {
        this.currentLocation = 'Current Location';
        // In a real app, you might want to convert coordinates to an address
      },
      error: (err) => {
        console.error('Error getting location', err);
        this.currentLocation = 'Location not available';
      }
    });
  }

  openLocationModal() {
    // This would open a modal to select location
    console.log('Opening location modal');
  }
}
