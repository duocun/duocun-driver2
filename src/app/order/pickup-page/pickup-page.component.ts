import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import * as moment from 'moment';
import { IMerchant, MerchantType, MerchantStatus } from '../../restaurant/restaurant.model';
import { OrderStatus, IOrder, IOrderItem, OrderType } from '../order.model';
import { MerchantService } from '../../restaurant/restaurant.service';
import { AccountService } from '../../account/account.service';
import { OrderService } from '../order.service';
import { Router } from '../../../../node_modules/@angular/router';
import { ILocation } from '../../location/location.model';
import { SharedService } from '../../shared/shared.service';
import { LocationService } from '../../location/location.service';
import { FormBuilder } from '../../../../node_modules/@angular/forms';
import { NgRedux } from '../../../../node_modules/@angular-redux/store';
import { IAppState } from '../../store';
import { IDelivery } from '../../delivery/delivery.model';
import { MatDatepickerInputEvent } from '../../../../node_modules/@angular/material';
import { PaymentMethod } from '../../payment/payment.model';
import { DeliveryActions } from '../../delivery/delivery.actions';

export const DriverStatus = {
  ACTIVE: 'A',
  INACTIVE: 'I'
};

@Component({
  selector: 'app-pickup-page',
  templateUrl: './pickup-page.component.html',
  styleUrls: ['./pickup-page.component.scss']
})
export class PickupPageComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();

  orders;
  pickups;
  account;
  merchants;
  groups;
  pickup = '11:20';

  dateForm;
  deliverDate;
  deliverTime;
  productGroups;

  PaymentMethod = PaymentMethod;
  Status = OrderStatus;

  constructor(
    private merchantSvc: MerchantService,
    private accountSvc: AccountService,
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private locationSvc: LocationService,
    private router: Router,
    private fb: FormBuilder,
    private rx: NgRedux<IAppState>
    // private snackBar: MatSnackBar
  ) {
    this.dateForm = this.fb.group({ date: [''] });

    this.rx.select<IDelivery>('delivery').pipe(takeUntil(this.onDestroy$)).subscribe((d: IDelivery) => {
      this.deliverDate = d.deliverDate;
      this.deliverTime = d.deliverTime;

      const dt = moment(this.deliverDate + 'T' + this.deliverTime + ':00.000Z');
      this.date.setValue(dt);
    });
  }

  get date() { return this.dateForm.get('date'); }

  ngOnInit() {
    this.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe(r => {
      const account = r.data;
      if (account) {
        this.account = account;
        this.mount(this.deliverDate, this.deliverTime).then(() => {

        });
      } else {
        this.router.navigate(['account/login']);
      }
    });

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // ngOnChanges(v) {
  //   this.mount(this.dateTime).then((orders: IOrder[]) => {
  //     this.dataSource = new MatTableDataSource(orders);
  //     this.dataSource.sort = this.sort;
  //     this.places = this.getMapMarkers(orders, this.colors);
  //   });
  // }

  mount(deliverDate, deliverTime) {
    const self = this;
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve) => {
      const q = { status: MerchantStatus.ACTIVE, type: { $in: [MerchantType.RESTAURANT, MerchantType.GROCERY] } };
      this.merchantSvc.find(q).pipe(takeUntil(this.onDestroy$)).subscribe((rs: any) => {
        const merchants = rs.data;
        this.reload(deliverDate, deliverTime).then((r: any) => {
          // update view
          self.merchants = merchants;
          this.groups = r.groups;
          this.orders = r.orders;
          this.productGroups = r.productGroups;
          // this.pickups = this.getPickupList();
          resolve();
        });
      });
    });
  }

  // reload only changable datas
  reload(deliverDate, deliverTime) {
    return new Promise((resolve, reject) => {
      const driverId = this.account._id;
      const qOrder = {
        driverId, deliverDate, // deliverTime,
        status: { $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP] }
      };
      this.orderSvc.find(qOrder).pipe(takeUntil(this.onDestroy$)).subscribe((r: any) => {
        const orders = r.data;
        this.orders = [...orders];
        // self.loading = false;
        const groups = this.groupByMerchants(orders);
        const productGroups = this.groupByProduct(OrderType.GROCERY, orders);

        resolve({ orders, groups, productGroups });
      });
    });
  }

  groupByProduct(type, orders) {
    const productMap = {};
    const rs = orders.filter(order => order.type === type);
    rs.forEach(r => {
      r.items.forEach(it => {
        productMap[it.productId] = { productName: it.productName, quantity: 0 };
      });
    });
    rs.forEach(r => {
      r.items.forEach(it => {
        productMap[it.productId].quantity += it.quantity;
      });
    });

    return Object.keys(productMap).map(pId => productMap[pId]);
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.deliverDate = moment(event.value).format('YYYY-MM-DD');
    const date = moment(event.value).set({ hour: 10, minute: 0, second: 0, millisecond: 0 });
    this.date.setValue(date);
    this.rx.dispatch({ type: DeliveryActions.UPDATE_DELIVER_DATE, payload: this.deliverDate }); 
    this.reload(this.deliverDate, this.deliverTime).then((r: any) => {
      this.groups = r.groups;
      this.orders = r.orders;
      this.productGroups = r.productGroups;
    });
  }

  // pickupTime --- eg. '11:20'
  // reload(accounts: IAccount[], pickupTime: string) {
  //   const self = this;
  //   const range = { $gt: moment().startOf('day').toISOString(), $lt: moment().endOf('day').toISOString() };
  //   const orderQuery = {
  //     driverId: this.account._id,
  //     delivered: range,
  //     pickup: pickupTime,
  //     status: { $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP] }
  //   };

  //   this.orderSvc.find(orderQuery).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
  //     self.loading = false;
  //     self.groups = this.groupByMerchants(accounts, orders);
  //   });
  // }

  getPickupList() {
    // const pickups = [];
    // // fix me in next stage;
    // schedules.map(s => {
    //   // if(s.)
    // });
    return ['10:00', '11:20'];
  }

  // return array of {merchantId: x, merchantName: x, items: [{order:x, status: x}, ... ]}
  groupByMerchants(orders: IOrder[]) {
    const merchantMap = {};
    orders.map(order => {
      merchantMap[order.merchantId] = { merchantName: order.merchantName, items: [] };
    });
    orders.map(order => {
      merchantMap[order.merchantId].items.push({ order, status: order.status, isPicked: this.isPicked(order) });
    });
    return Object.keys(merchantMap).map(mId => merchantMap[mId]);
  }

  isPicked(order: IOrder) {
    return order.status === OrderStatus.LOADED || order.status === OrderStatus.DONE;
  }

  hasBeverage(order) {
    let bHas = false;
    order.items.map(item => {
      if (item && item.product && item.product.categoryId === '5cbc5df61f85de03fd9e1f12') {
        bHas = true;
      }
    });
    return bHas;
  }

  shouldExpend(it) {
    return (it.status !== OrderStatus.DONE || it.status !== OrderStatus.LOADED) && this.hasBeverage(it.order);
  }

  getQuantity(order: IOrder) {
    let quantity = 0;
    order.items.map((item: IOrderItem) => {
      quantity += item.quantity;
    });
    return quantity;
  }
  getAddress(location: ILocation) {
    return this.locationSvc.getAddrString(location);
  }
  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }
  navigateTo(location: ILocation) {
    (<any>window).location = encodeURI('https://www.google.com/maps/dir/?api=1&destination=' +
      + location.streetNumber + '+' + location.streetName + '+'
      + (location.subLocality ? location.subLocality : location.city) + '+'
      + location.province
      + '&destination_placeId=' + location.placeId);
  }

  // patition(orders: IOrder[], malls: IMall[]) {
  //   const groupedOrders = [];
  //   orders.map((order: IOrder) => {
  //     const row = [];
  //     let shortest = this.locationSvc.getDirectDistance(order.location, { lat: malls[0].lat, lng: malls[0].lng });
  //     let selectedMall = malls[0];

  //     malls.map((mall: IMall) => {
  //       const distance = this.locationSvc.getDirectDistance(order.location, { lat: mall.lat, lng: mall.lng });
  //       if (shortest > distance) {
  //         selectedMall = mall;
  //         shortest = distance;
  //       }
  //     });
  //     groupedOrders.push({ order: order, mall: selectedMall, distance: shortest });
  //   });
  //   return groupedOrders;
  // }
  getProductCssClass(item) {
    if (item && item.product && item.product.categoryId === '5cbc5df61f85de03fd9e1f12') {
      return 'beverage';
    } else {
      return 'product';
    }
  }
  onSelectPickup(e) {
    this.pickup = e.value;
    this.reload(this.deliverDate, this.deliverTime).then((r: any) => {
      this.groups = r.groups;
      this.orders = r.orders;
      this.productGroups = r.productGroups;
    });
  }

  allowReceivablesBlock(it) {
    if (it.order.paymentMethod === PaymentMethod.CASH || (it.balance >= 0 && it.status !== OrderStatus.DONE)) {
      return true;
    } else {
      return false;
    }
  }
}
