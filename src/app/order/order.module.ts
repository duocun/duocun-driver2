import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SharedModule } from '../shared/shared.module';
import { OrderService } from './order.service';
import { OrderRoutingModule } from './order-routing.module';
import { MerchantService } from '../restaurant/restaurant.service';
import { AccountService } from '../account/account.service';
import { MapPageComponent } from './map-page/map-page.component';
import { ClientPaymentService } from '../payment/client-payment.service';
import { MerchantBalanceService } from '../payment/merchant-balance.service';
import { ClientBalanceService } from '../payment/client-balance.service';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule, MatButtonToggleModule, MatFormFieldModule, MatInputModule } from '../../../node_modules/@angular/material';

import { TransactionService } from '../transaction/transaction.service';
import { ReceiveCashDialogComponent } from './receive-cash-dialog/receive-cash-dialog.component';
import { ClientBalanceDialogComponent } from './client-balance-dialog/client-balance-dialog.component';

import { SharedService } from '../shared/shared.service';
import { LocationService } from '../location/location.service';
import { DeliveryDialogComponent } from './delivery-dialog/delivery-dialog.component';
import { PickupPageComponent } from './pickup-page/pickup-page.component';
import { PickupService } from './pickup.service';

@NgModule({
  imports: [
    CommonModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatMomentDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatButtonToggleModule,
    OrderRoutingModule,
    SharedModule
  ],
  exports: [
  ],
  providers: [
    OrderService,
    MerchantService,
    AccountService,
    ClientBalanceService,
    ClientPaymentService,
    MerchantBalanceService,
    TransactionService,
    LocationService,
    PickupService,
    SharedService
  ],
  declarations: [
    MapPageComponent,
    ReceiveCashDialogComponent,
    ClientBalanceDialogComponent,
    DeliveryDialogComponent,
    PickupPageComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [ReceiveCashDialogComponent, ClientBalanceDialogComponent]
})
export class OrderModule { }
