import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { 
  shieldOutline, 
  personOutline, 
  storefrontOutline, 
  bicycleOutline 
} from 'ionicons/icons';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/angular/standalone';

interface DemoAccount {
  role: string;
  email: string;
  password: string;
  description: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterLink,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonBackButton,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent
  ]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;
  loginError: string | null = null;
  demoAccounts: DemoAccount[] = [
    {
      role: 'admin',
      email: 'suraj@admin.com',
      password: '12345',
      description: 'Admin Dashboard'
    },
    {
      role: 'user',
      email: 'suraj@user.com',
      password: '12345',
      description: 'Customer Account'
    },
    {
      role: 'seller',
      email: 'suraj@seller.com',
      password: '12345',
      description: 'Restaurant Owner'
    },
    {
      role: 'delivery',
      email: 'suraj@delivery.com',
      password: '12345',
      description: 'Delivery Partner'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({
      shieldOutline,
      personOutline,
      storefrontOutline,
      bicycleOutline
    });
  }

  ngOnInit() {
    // If user is already logged in, redirect to appropriate dashboard
    if (this.authService.isAuthenticated()) {
      this.navigateByRole();
      return;
    }
    
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.loginError = null;

    if (this.loginForm.valid) {
      this.isLoading = true;
      
      console.log('Attempting login with:', this.loginForm.value.email);

      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful, user data:', response);
          console.log('Current user role:', this.authService.getUserRole());
          
          // Set a small timeout to ensure the current user is set before navigation
          setTimeout(() => {
            this.navigateByRole();
          }, 100);
        },
        error: (error) => {
          this.isLoading = false;
          this.loginError = error.error?.message || 'Login failed. Please check your credentials.';
          console.error('Login error:', error);
          
          // Show error alert
          this.presentAlert('Login Failed', this.loginError || 'Login failed. Please check your credentials.');
        }
      });
    }
  }

  // Navigate to appropriate dashboard based on user role
  navigateByRole() {
    const userRole = this.authService.getUserRole();
    console.log('Navigating based on role:', userRole);
    
    if (!userRole) {
      console.error('No user role found, cannot navigate. Logged in user:', this.authService.currentUserValue);
      // Set a longer timeout to retry - sometimes token processing takes time
      setTimeout(() => this.navigateByRole(), 500);
      return;
    }

    switch (userRole) {
      case 'admin':
        console.log('Navigating to admin dashboard');
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'seller':
        console.log('Navigating to seller dashboard');
        this.router.navigate(['/seller-dashboard']);
        break;
      case 'delivery':
        console.log('Navigating to delivery dashboard');
        this.router.navigate(['/delivery-dashboard']);
        break;
      case 'user':
        console.log('Navigating to user home');
        this.router.navigate(['/tabs/home']);
        break;
      default:
        console.log('No role found, staying on login page');
        break;
    }
  }

  // Fill demo account credentials
  fillDemoCredentials(account: DemoAccount) {
    this.loginForm.setValue({
      email: account.email,
      password: account.password
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'Forgot Password',
      message: 'Enter your email address to receive a password reset link.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Reset Password',
          handler: (data) => {
            if (data.email) {
              // For demo, just show a success message
              this.presentAlert(
                'Password Reset Email Sent', 
                `Instructions to reset your password have been sent to ${data.email}. Please check your inbox.`
              );
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
