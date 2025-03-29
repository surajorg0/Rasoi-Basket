import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { 
  personOutline,
  logOutOutline,
  storefrontOutline,
  cartOutline,
  alertCircleOutline,
  statsChartOutline,
  settingsOutline,
  timeOutline,
  arrowForward,
  addOutline,
  pizzaOutline,
  walletOutline
} from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonChip
} from '@ionic/angular/standalone';

interface OrderSummary {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
}

interface ProductSummary {
  total: number;
  active: number;
  outOfStock: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  items: { name: string, quantity: number }[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  orderTime: Date;
}

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSpinner,
    IonChip
  ]
})
export class SellerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  storeStatus: 'open' | 'closed' = 'open';
  orderSummary: OrderSummary = {
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  };
  productSummary: ProductSummary = {
    total: 0,
    active: 0,
    outOfStock: 0
  };
  recentOrders: RecentOrder[] = [];
  earnings = {
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  };
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({
      personOutline,
      logOutOutline,
      storefrontOutline,
      cartOutline,
      alertCircleOutline,
      statsChartOutline,
      settingsOutline,
      timeOutline,
      arrowForward,
      addOutline,
      pizzaOutline,
      walletOutline
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  loadDashboardData() {
    // In a real app, this would be loaded from a service
    setTimeout(() => {
      this.orderSummary = {
        total: 125,
        pending: 8,
        completed: 112,
        cancelled: 5
      };
      
      this.productSummary = {
        total: 32,
        active: 28,
        outOfStock: 4
      };
      
      this.recentOrders = [
        {
          id: 'ORD-7839',
          customerName: 'Rahul Sharma',
          items: [
            { name: 'Butter Chicken', quantity: 1 },
            { name: 'Naan', quantity: 2 }
          ],
          total: 450,
          status: 'pending',
          orderTime: new Date(Date.now() - 30 * 60000) // 30 minutes ago
        },
        {
          id: 'ORD-7838',
          customerName: 'Priya Singh',
          items: [
            { name: 'Paneer Tikka', quantity: 1 },
            { name: 'Roti', quantity: 3 }
          ],
          total: 380,
          status: 'processing',
          orderTime: new Date(Date.now() - 90 * 60000) // 90 minutes ago
        },
        {
          id: 'ORD-7837',
          customerName: 'Amit Patel',
          items: [
            { name: 'Veg Biryani', quantity: 2 }
          ],
          total: 500,
          status: 'completed',
          orderTime: new Date(Date.now() - 180 * 60000) // 3 hours ago
        }
      ];
      
      this.earnings = {
        today: 2850,
        thisWeek: 18500,
        thisMonth: 68000
      };
      
      this.isLoading = false;
    }, 1000);
  }

  toggleStoreStatus() {
    this.storeStatus = this.storeStatus === 'open' ? 'closed' : 'open';
    // In a real app, this would call a service to update the store status
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  getOrderStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'medium';
    }
  }

  formatOrderTime(time: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return time.toLocaleDateString();
    }
  }
}
