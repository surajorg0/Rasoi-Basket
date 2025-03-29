import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonSegment,
    IonSegmentButton,
    IonLabel
  ]
})
export class CategoryFilterComponent implements OnInit {
  @Input() selectedCategory: string = 'all';
  @Output() categoryChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  categoryChanged(event: any) {
    const category = event.detail.value;
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }
}
