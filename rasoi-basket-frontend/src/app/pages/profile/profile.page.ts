import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  mailOutline, 
  callOutline, 
  logOutOutline,
  settingsOutline,
  heartOutline,
  locationOutline,
  timeOutline,
  moonOutline,
  sunnyOutline,
  languageOutline,
  lockClosedOutline,
  helpCircleOutline,
  informationCircleOutline,
  arrowForwardOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, FormsModule]
})
export class ProfilePage implements OnInit {
  currentUser: User | null = null;
  isDarkMode: boolean = false;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({
      personOutline,
      mailOutline,
      callOutline,
      logOutOutline,
      settingsOutline,
      heartOutline,
      locationOutline,
      timeOutline,
      moonOutline,
      sunnyOutline,
      languageOutline,
      lockClosedOutline,
      helpCircleOutline,
      informationCircleOutline,
      arrowForwardOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.isDarkMode = this.currentUser?.darkMode || false;
  }

  toggleDarkMode() {
    if (this.currentUser) {
      // Update user settings
      this.authService.updateSettings({ darkMode: this.isDarkMode }).subscribe({
        next: (response) => {
          console.log('Dark mode settings updated');
        },
        error: (error) => {
          console.error('Error updating settings', error);
        }
      });
    }
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
}
