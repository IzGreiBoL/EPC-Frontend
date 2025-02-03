import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services.component';
import { OtherServices } from './other-services/other-services.component';
import { CustomHomeDesignComponent } from './custom-home-design/custom-home-design.component';

const routes: Routes = [
  { path: '', component: ServicesComponent },
  { path: 'custom-home-design', component: CustomHomeDesignComponent },
  { path: ':slug', component: OtherServices },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }