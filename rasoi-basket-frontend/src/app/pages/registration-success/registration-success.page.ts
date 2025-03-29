import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, homeOutline, logInOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.page.html',
  styleUrls: ['./registration-success.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon
  ]
})
export class RegistrationSuccessPage implements OnInit {
  isSeller = false;
  isDelivery = false;
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {
    addIcons({
      checkmarkCircleOutline,
      homeOutline,
      logInOutline
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const role = params['role'];
      this.email = params['email'] || '';
      this.isSeller = role === 'seller';
      this.isDelivery = role === 'delivery';
    });
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/login');
  }

  goToHome() {
    this.navCtrl.navigateRoot('/tabs/home');
  }
} 