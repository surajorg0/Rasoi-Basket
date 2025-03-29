import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ToastController } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { 
  peopleOutline, 
  timeOutline, 
  restaurantOutline, 
  logOutOutline,
  arrowForward,
  checkmarkOutline,
  closeOutline,
  checkmarkCircleOutline,
  storefront
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
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonBadge,
  IonSpinner
} from '@ionic/angular/standalone';

interface UserStats {
  total: number;
  customers: number;
  sellers: number;
  delivery: number;
}

interface SellerStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
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
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonBadge,
    IonSpinner
  ]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  pendingApprovals: User[] = [];
  isLoading = true;
  loadingError: string | null = null;
  userStats: UserStats = {
    total: 0,
    customers: 0,
    sellers: 0,
    delivery: 0
  };
  sellerStats: SellerStats = {
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      peopleOutline,
      timeOutline,
      restaurantOutline,
      logOutOutline,
      arrowForward,
      checkmarkOutline,
      closeOutline,
      checkmarkCircleOutline,
      storefront
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.loadingError = null;
    
    // Load all necessary data
    Promise.all([
      this.loadPendingApprovals(),
      this.loadUserStats(),
      this.loadSellerStats()
    ])
    .catch(error => {
      console.error('Error loading dashboard data', error);
      this.loadingError = 'Failed to load dashboard data. Please try again.';
    })
    .finally(() => {
      this.isLoading = false;
    });
  }

  async loadPendingApprovals(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authService.getPendingApprovals().subscribe({
        next: (approvals) => {
          this.pendingApprovals = approvals;
          resolve();
        },
        error: (error) => {
          console.error('Error loading pending approvals', error);
          reject(error);
        }
      });
    });
  }

  async loadUserStats(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authService.getAllUsers().subscribe({
        next: (users) => {
          this.userStats = {
            total: users.length,
            customers: users.filter(u => u.role === 'user').length,
            sellers: users.filter(u => u.role === 'seller').length,
            delivery: users.filter(u => u.role === 'delivery').length
          };
          resolve();
        },
        error: (error) => {
          console.error('Error loading user stats', error);
          reject(error);
        }
      });
    });
  }

  async loadSellerStats(): Promise<void> {
    return new Promise((resolve) => {
      // Get seller stats from user data
      this.authService.getAllUsers().subscribe({
        next: (users) => {
          const sellers = users.filter(u => u.role === 'seller');
          this.sellerStats = {
            total: sellers.length,
            active: sellers.filter(s => s.isApproved && s.status === 'active').length,
            pending: sellers.filter(s => !s.isApproved && s.status === 'pending').length,
            inactive: sellers.filter(s => s.status === 'inactive' || s.status === 'rejected').length
          };
          resolve();
        },
        error: (error) => {
          console.error('Error loading seller stats', error);
          // Use default stats if there's an error
          this.sellerStats = {
            total: 0,
            active: 0,
            pending: 0,
            inactive: 0
          };
          resolve();
        }
      });
    });
  }

  async approveUser(userId: string, userName: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Approval',
      message: `Are you sure you want to approve ${userName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Approve',
          handler: () => {
            this.authService.approveUser(userId).subscribe({
              next: (response) => {
                this.presentToast(`${userName} has been approved successfully.`, 'success');
                this.loadDashboardData();
              },
              error: (error) => {
                console.error('Error approving user', error);
                this.presentToast(`Failed to approve ${userName}. Please try again.`, 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async rejectUser(userId: string, userName: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Rejection',
      message: `Are you sure you want to reject ${userName}?`,
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason for rejection (optional)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Reject',
          handler: (data) => {
            this.authService.rejectUser(userId, data.reason || '').subscribe({
              next: (response) => {
                this.presentToast(`${userName} has been rejected.`, 'success');
                this.loadDashboardData();
              },
              error: (error) => {
                console.error('Error rejecting user', error);
                this.presentToast(`Failed to reject ${userName}. Please try again.`, 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  refreshData() {
    this.loadDashboardData();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
