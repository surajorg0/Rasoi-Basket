import { Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../pages/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'search',
        loadComponent: () => import('../pages/search/search.page').then(m => m.SearchPage),
      },
      {
        path: 'cart',
        loadComponent: () => import('../pages/cart/cart.page').then(m => m.CartPage),
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        loadComponent: () => import('../pages/profile/profile.page').then(m => m.ProfilePage),
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
]; 