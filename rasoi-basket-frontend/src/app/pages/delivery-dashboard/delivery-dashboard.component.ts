import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { 
  personOutline,
  logOutOutline,
  bicycleOutline,
  timerOutline,
  checkmarkDoneOutline,
  locationOutline,
  cashOutline,
  callOutline,
  navigateOutline,
  statsChartOutline,
  cardOutline,
  storefrontOutline
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

interface DeliveryOrder {
  id: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  sellerName: string;
  sellerAddress: string;
  sellerPhone: string;
  status: 'pending' | 'picked' | 'delivered' | 'cancelled';
  distance: number;
  estimatedTime: string;
  orderTime: Date;
  paymentMethod: 'online' | 'cash';
  amount: number;
}

interface DeliverySummary {
  total: number;
  pending: number;
  delivered: number;
  cancelled: number;
}

@Component({
  selector: 'app-delivery-dashboard',
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.scss'],
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
export class DeliveryDashboardComponent implements OnInit {
  currentUser: User | null = null;
  deliveryStatus: 'online' | 'offline' = 'online';
  pendingDeliveries: DeliveryOrder[] = [];
  deliverySummary: DeliverySummary = {
    total: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0
  };
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
      bicycleOutline,
      timerOutline,
      checkmarkDoneOutline,
      locationOutline,
      cashOutline,
      callOutline,
      navigateOutline,
      statsChartOutline,
      cardOutline,
      storefrontOutline
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  loadDashboardData() {
    // In a real app, this would be loaded from a service
    setTimeout(() => {
      this.pendingDeliveries = [
        {
          id: 'ORD-7832',
          customerName: 'Ananya Gupta',
          customerAddress: '123 Main St, Bangalore',
          customerPhone: '+91 9876543210',
          sellerName: 'Spice Garden',
          sellerAddress: '456 Food Lane, Bangalore',
          sellerPhone: '+91 9876543211',
          status: 'pending',
          distance: 3.5,
          estimatedTime: '25 mins',
          orderTime: new Date(Date.now() - 20 * 60000), // 20 minutes ago
          paymentMethod: 'online',
          amount: 450
        },
        {
          id: 'ORD-7833',
          customerName: 'Karan Mehta',
          customerAddress: '789 Park Avenue, Bangalore',
          customerPhone: '+91 9876543212',
          sellerName: 'Punjab Tadka',
          sellerAddress: '321 Food Court, Bangalore',
          sellerPhone: '+91 9876543213',
          status: 'picked',
          distance: 2.1,
          estimatedTime: '15 mins',
          orderTime: new Date(Date.now() - 35 * 60000), // 35 minutes ago
          paymentMethod: 'cash',
          amount: 680
        }
      ];
      
      this.deliverySummary = {
        total: 125,
        pending: 2,
        delivered: 118,
        cancelled: 5
      };
      
      this.earnings = {
        today: 850,
        thisWeek: 5640,
        thisMonth: 21500
      };
      
      this.isLoading = false;
    }, 1000);
  }

  toggleDeliveryStatus() {
    this.deliveryStatus = this.deliveryStatus === 'online' ? 'offline' : 'online';
    // In a real app, this would call a service to update the delivery status
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warning';
      case 'picked': return 'primary';
      case 'delivered': return 'success';
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

  updateOrderStatus(order: DeliveryOrder, status: 'picked' | 'delivered') {
    // In a real app, this would call a service to update the order status
    order.status = status;
    
    if (status === 'delivered') {
      setTimeout(() => {
        // Remove from pending deliveries list after a delay to show the status change
        this.pendingDeliveries = this.pendingDeliveries.filter(o => o.id !== order.id);
        this.deliverySummary.pending--;
        this.deliverySummary.delivered++;
      }, 2000);
    }
  }

  callCustomer(phone: string) {
    // In a real app, this would use a device plugin to make a call
    window.open(`tel:${phone}`);
  }

  navigate(address: string) {
    // In a real app, this would open the default map app with navigation
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com?q=${encodedAddress}`);
  }
}
