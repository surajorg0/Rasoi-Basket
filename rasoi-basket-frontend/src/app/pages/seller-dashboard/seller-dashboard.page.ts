import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.page.html',
  styleUrls: ['./seller-dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SellerDashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
