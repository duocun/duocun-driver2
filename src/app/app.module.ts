import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { rootReducer, INITIAL_STATE } from './store';

import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';

import { AuthService } from './account/auth.service';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { EntityService } from './entity.service';
import { AccountService } from './account/account.service';


const appRoutes: Routes = [

    // { path: 'restaurant-detail/:id', component: RestaurantDetailComponent },


    // { path: 'restaurants/:id', component: RestaurantDetailPageComponent},
    {
      path: 'restaurant',
      loadChildren: () => import('./restaurant/restaurant.module').then(m => m.RestaurantModule)
    },
    {
      path: 'product',
      loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
    },
    {
      path: 'order',
      loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
    },
    {
      path: 'delivery',
      loadChildren: () => import('./delivery/delivery.module').then(m => m.DeliveryModule)
    },
    {
      path: 'contact',
      loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
    },
    {
      path: 'account',
      loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
    },
    {
      path: 'payment',
      loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
    },
    {
      path: 'main',
      loadChildren: () => import('./main/main.module').then(m => m.MainModule)
    },
    {
      path: '',
      loadChildren: () => import('./main/main.module').then(m => m.MainModule)
    },
];



@NgModule({
    declarations: [
      AppComponent,
      FooterComponent
    ],
    imports: [
        BrowserModule,
        CoreModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(
            appRoutes
            // { enableTracing: true } // <-- debugging purposes only
        ),
        // SDKBrowserModule.forRoot(), // for socket
        NgReduxModule,
        BrowserAnimationsModule,

        // SharedModule,
        // MainModule,
        // AccountModule,
        // SharedModule,
        // AdminModule,
        // RestaurantModule,
        // ProductModule,
        // OrderModule,
        // PageModule,
        // LocationModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
    providers: [
      EntityService,
      AuthService,
      AccountService,
      // SharedService,
      // {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig}
    ],

})
export class AppModule {
    constructor(ngRedux: NgRedux<any>) {
      ngRedux.configureStore(rootReducer, INITIAL_STATE);
   }
}
