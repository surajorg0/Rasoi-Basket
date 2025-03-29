import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

// Import Ionic standalone components
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonBackButton, IonIcon, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonList, IonAvatar, IonThumbnail, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonGrid, IonRow, IonCol, IonBadge, IonSearchbar, IonSegment, IonSegmentButton,
  IonFab, IonFabButton, IonMenuButton, IonMenu, IonMenuToggle, IonToggle, IonSpinner, IonTextarea,
  IonChip, IonLoading, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher,
  IonRefresherContent, IonNote, IonRippleEffect, IonImg, IonFooter, IonText, IonPopover } from '@ionic/angular/standalone';

const IONIC_COMPONENTS = [
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonBackButton, IonIcon, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonList, IonAvatar, IonThumbnail, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonGrid, IonRow, IonCol, IonBadge, IonSearchbar, IonSegment, IonSegmentButton,
  IonFab, IonFabButton, IonMenuButton, IonMenu, IonMenuToggle, IonToggle, IonSpinner, IonTextarea,
  IonChip, IonLoading, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher,
  IonRefresherContent, IonNote, IonRippleEffect, IonImg, IonFooter, IonText, IonPopover
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule
  ]
})
export class SharedModule { } 