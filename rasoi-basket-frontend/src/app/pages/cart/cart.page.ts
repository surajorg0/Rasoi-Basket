import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline, removeOutline } from 'ionicons/icons';

interface CartItem {
  id: number;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  isLoading: boolean = true;

  constructor() {
    addIcons({
      trashOutline,
      addOutline,
      removeOutline
    });
  }

  ngOnInit() {
    // Mock loading cart items
    setTimeout(() => {
      this.cartItems = [
        {
          id: 1,
          name: 'Paneer Butter Masala',
          restaurant: 'Spice Garden',
          price: 299,
          quantity: 1,
          image: 'assets/images/food-placeholder.jpg'
        },
        {
          id: 2,
          name: 'Garlic Naan',
          restaurant: 'Spice Garden',
          price: 50,
          quantity: 2,
          image: 'assets/images/food-placeholder.jpg'
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getDeliveryFee(): number {
    return this.cartItems.length > 0 ? 40 : 0;
  }

  getTaxes(): number {
    return Math.round(this.getSubtotal() * 0.05);
  }

  getTotal(): number {
    return this.getSubtotal() + this.getDeliveryFee() + this.getTaxes();
  }

  increaseQuantity(item: CartItem) {
    item.quantity += 1;
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  clearCart() {
    this.cartItems = [];
  }
}
