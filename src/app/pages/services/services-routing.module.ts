import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services.component';
import { ServiceDetailComponent } from './services-detail/services-detail.component';

const routes: Routes = [
  { path: '', component: ServicesComponent },
  { path: ':slug', component: ServiceDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }