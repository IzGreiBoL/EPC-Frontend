import { Routes } from '@angular/router';
import { HomeLayoutComponent } from '../../layouts/home-layout/home-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../../pages/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'quotes',
        loadChildren: () => import('../../pages/quotes/quotes.module').then(m => m.QuotesModule)
      }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];