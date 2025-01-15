import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotesComponent } from './quotes.component';
import { QuoteDetailComponent } from './quote-detail/quote-detail.component';

const routes: Routes = [
  { path: '', component: QuotesComponent },
  { path: 'detail/:id', component: QuoteDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotesRoutingModule {}