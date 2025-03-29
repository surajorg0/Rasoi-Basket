import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class SearchPage {
  searchTerm: string = '';
  searchResults: any[] = [];
  isSearching: boolean = false;

  constructor() { }

  onSearch() {
    this.isSearching = true;
    
    // Mock search functionality
    setTimeout(() => {
      this.searchResults = [
        { id: 1, name: 'Paneer Butter Masala', restaurant: 'Spice Garden', price: 299, rating: 4.5 },
        { id: 2, name: 'Veg Biryani', restaurant: 'Biryani Palace', price: 250, rating: 4.2 },
        { id: 3, name: 'Chicken Curry', restaurant: 'Curry House', price: 350, rating: 4.7 },
        { id: 4, name: 'Masala Dosa', restaurant: 'South Express', price: 120, rating: 4.3 },
        { id: 5, name: 'Chole Bhature', restaurant: 'Punjab Delight', price: 180, rating: 4.1 }
      ].filter(item => 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        item.restaurant.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      
      this.isSearching = false;
    }, 1000);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResults = [];
  }
} 