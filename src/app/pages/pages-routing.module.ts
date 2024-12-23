import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotesComponent } from './quotes/quotes.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'quotes', component: QuotesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}