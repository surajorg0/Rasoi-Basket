import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryDashboardPage } from './delivery-dashboard.page';

describe('DeliveryDashboardPage', () => {
  let component: DeliveryDashboardPage;
  let fixture: ComponentFixture<DeliveryDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
