import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapPageComponent } from './map-page/map-page.component';
import { PickupPageComponent } from './pickup-page/pickup-page.component';
import { PickupByOrderPageComponent } from './pickup-by-order-page/pickup-by-order-page.component';

const routes: Routes = [
  { path: 'pickup', component: PickupPageComponent },
  { path: 'pickup-by-order', component: PickupByOrderPageComponent },
  { path: 'map', component: MapPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
