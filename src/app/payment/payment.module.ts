import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { MerchantPaymentPageComponent } from './merchant-payment-page/merchant-payment-page.component';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AccountService } from '../account/account.service';
import { DriverPaymentPageComponent } from './driver-payment-page/driver-payment-page.component';
import { MerchantBalanceService } from './merchant-balance.service';
import { DriverSalaryPageComponent } from './driver-salary-page/driver-salary-page.component';
import { OrderService } from '../order/order.service';
import { MerchantService } from '../restaurant/restaurant.service';
import { ClientBalanceService } from './client-balance.service';
import { PaginatePipe, NgxPaginationModule } from '../../../node_modules/ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxPaginationModule,
  ],
  declarations: [
    MerchantPaymentPageComponent,
    DriverPaymentPageComponent,
    DriverSalaryPageComponent,
  ],
  providers: [
    AccountService,
    MerchantBalanceService,
    OrderService,
    MerchantService,
    ClientBalanceService,
    PaginatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentModule { }
