import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotesComponent } from './quotes.component';
import { BasicQuoteComponent } from './basic-quote/basic-quote.component';
import { AdvancedQuoteComponent } from './advanced-quote/advanced-quote.component';
import { CustomQuoteComponent } from './custom-quote/custom-quote.component';

const routes: Routes = [
  { path: '', component: QuotesComponent },
  { path: 'detail/:id/basic', component: BasicQuoteComponent },
  { path: 'detail/:id/advanced', component: AdvancedQuoteComponent },
  { path: 'detail/:id/custom', component: CustomQuoteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotesRoutingModule {}