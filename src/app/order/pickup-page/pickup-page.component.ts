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
import { MatDatepickerInputEvent, MatSnackBar } from '../../../../node_modules/@angular/material';
import { PaymentMethod } from '../../payment/payment.model';
import { PickupService } from '../pickup.service';
export const DriverStatus = {
  ACTIVE: 'A',
  INACTIVE: 'I'
};

export const PickupStatus = {
  UNPICK_UP: 'U',
  PICKED_UP: 'P'
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
  deliverDate = moment().format('YYYY-MM-DD');
  productGroups;
  PaymentMethod = PaymentMethod;

  constructor(
    private fb: FormBuilder,
    private merchantSvc: MerchantService,
    private accountSvc: AccountService,
    private orderSvc: OrderService,
    private pickupSvc: PickupService,
    private sharedSvc: SharedService,
    private locationSvc: LocationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dateForm = this.fb.group({ date: [''] });

  }

  get date() { return this.dateForm.get('date'); }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.deliverDate = moment(event.value).format('YYYY-MM-DD');
    const date = moment(event.value).set({ hour: 10, minute: 0, second: 0, millisecond: 0 });
    this.date.setValue(date);

    this.reload(this.pickup, this.deliverDate, OrderType.GROCERY).then(() => {

    });
  }

  ngOnInit() {
    this.mount().then((account) => {
      if (account) {
        this.groups = this.groupByMerchants(this.orders);
      } else {
        this.router.navigate(['account/setting'], { queryParams: { merchant: false } }); // fix me
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
  getDateRange(deliverDate) {
    const sDate = moment(deliverDate).format('YYYY-MM-DD');
    const start = moment(sDate).toISOString();
    const end = moment(sDate).add(1, 'days').toISOString();
    return { $gt: start, $lt: end };
  }

  getDelivered(date) {
    return date + 'T15:00:00.000Z';
  }

  mount() {
    const self = this;
    const pickupTime = this.pickup;
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      // const status = DriverStatus.ACTIVE;
      this.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
        self.account = account;

        if (account) {
          const q = { status: MerchantStatus.ACTIVE, type: { $in: [MerchantType.RESTAURANT, MerchantType.GROCERY] } };
          self.merchantSvc.quickFind(q).pipe(takeUntil(this.onDestroy$)).subscribe((rs: IMerchant[]) => {
            self.merchants = rs;

            const delivered = this.getDelivered(this.deliverDate); // this.getDateRange(this.deliverDate);
            const driverId = account._id;
            const qOrder = {
              pickupTime,
              driverId,
              delivered,
              status: { $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP] }
            };
            this.orderSvc.find(qOrder).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
              const qPickup = { delivered, driverId };
              // this.pickupSvc.find(qPickup).pipe(takeUntil(this.onDestroy$)).subscribe((pickupList: any[]) => {
              this.orders = [...orders];
              this.pickups = this.getPickupTimeList();
              resolve(account);
              // });
            });
          });
        } else { // not authorized for opreration merchant
          resolve();
        }
      });
    });
  }

  // pickupTime --- eg. '11:20' OrderType.GROCERY
  reload(pickupTime: string, deliverDate: string, type: string) {
    return new Promise(resolve => {
      if (this.account) {
        const driverId = this.account._id;
        const orderQuery = {
          driverId,
          deliverDate,
          // pickupTime,
          type,
          status: { $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP] }
        };
        this.orderSvc.find(orderQuery).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
          const delivered = this.getDelivered(this.deliverDate); // this.getDateRange(deliverDate);
          const qPickup = { delivered, driverId };
          this.pickupSvc.find(qPickup).pipe(takeUntil(this.onDestroy$)).subscribe((r: any) => {
            const pickups = r.data;
            const groups = this.groupByMerchants(orders);
            const productGroups = this.groupByProduct(type, orders, pickups);
            this.orders = orders;
            this.groups = groups;
            this.productGroups = productGroups;
            resolve({ orders, groups, productGroups });
          });
        });
      } else {
        this.router.navigate(['account/login']);
        resolve();
      }
    });
  }

  // return [{merchantId: x, merchantName: x, items: [{order:x, status: x}, ... ]}]
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

  groupByProduct(type, orders, pickups) {
    const productMap = {};
    const rs = orders.filter(order => order.type === type);
    rs.forEach(r => {
      const driverId = r.driverId;
      const delivered = r.delivered;
      r.items.forEach(it => {
        const productId = it.product._id;
        const productName = it.product.name;
        productMap[it.productId] = { _id: '', driverId, delivered, productId, productName, quantity: 0, status: PickupStatus.UNPICK_UP };
      });
    });
    rs.forEach(r => {
      r.items.forEach(it => {
        productMap[it.productId].quantity += it.quantity;
      });
    });

    if (pickups && pickups.length > 0) {
      pickups.forEach((pickup: any) => {
        if (productMap.hasOwnProperty(pickup.productId)) {
          productMap[pickup.productId]._id = pickup._id;
          productMap[pickup.productId].status = pickup.status;
        }
      });
    }

    return Object.keys(productMap).map(pId => productMap[pId]);
  }

  getPickupTimeList() {
    // const pickups = [];
    // // fix me in next stage;
    // schedules.map(s => {
    //   // if(s.)
    // });
    return ['10:00', '11:20'];
  }

  isPicked(order: IOrder) {
    return order.status === OrderStatus.LOADED || order.status === OrderStatus.DONE;
  }

  getProductCssClass(item) {
    if (item && item.product && item.product.categoryId === '5cbc5df61f85de03fd9e1f12') {
      return 'beverage';
    } else {
      return 'product';
    }
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

  onSelectPickup(e) {
    this.pickup = e.value;
    this.reload(this.pickup, this.deliverDate, OrderType.GROCERY).then((orders: IOrder[]) => {
      this.orders = orders;
      this.groups = this.groupByMerchants(this.orders);
      // let list;
      // if (this.pickup === '所有订单') {
      //   list = orders;
      // } else {
      //   list = this.orders.filter(order => order.pickupTime === this.pickup);
      // }
    });
  }

  onReload() {
    this.reload(this.pickup, this.deliverDate, OrderType.GROCERY).then((r) => {
      if (r) {
        this.snackBar.open('', '订单已更新', { duration: 1800 });
      }
    });
  }

  // for food delivery
  onChangePicked(order: IOrder) {
    if (order.status !== OrderStatus.DONE) {
      const data = { status: order.status === OrderStatus.LOADED ? OrderStatus.NEW : OrderStatus.LOADED };
      this.orderSvc.update({ _id: order._id }, data).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.snackBar.open('', '取餐状态已更改', { duration: 1000 });
        this.reload(this.pickup, this.deliverDate, OrderType.GROCERY).then((r: any) => {
          // this.orders = r.orders;
          // this.groups = r.groups;
          // this.productGroups = r.productGroups;
        });
      });
    }
  }

  isPickedUp(row: any) {
    return row.status === PickupStatus.PICKED_UP;
  }

  // for grocery
  // row --- { driverId, delivered, productName, quantity: 0, status: PickupStatus.UNPICK_UP };
  onChangePickup(event: any, row: any) {
    const query = { driverId: row.driverId, delivered: row.delivered, productId: row.productId };
    const status = event.checked ? PickupStatus.PICKED_UP : PickupStatus.UNPICK_UP;
    if (row._id) {
      const data = { ...row, status };
      this.pickupSvc.update(query, data).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.snackBar.open('', '取货状态已更改', { duration: 1000 });
        this.reload(this.pickup, this.deliverDate, OrderType.GROCERY).then((r: any) => {
          // this.orders = r.orders;
          // this.groups = r.groups;
          // this.productGroups = r.productGroups;
        });
      });
    } else {
      delete row._id;
      const data = { ...row, status };
      this.pickupSvc.save(data).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.snackBar.open('', '取货状态已更改', { duration: 1000 });
        this.reload(this.pickup, this.deliverDate, OrderType.GROCERY).then((r: any) => {
          // this.orders = r.orders;
          // this.groups = r.groups;
          // this.productGroups = r.productGroups;
        });
      });
    }
  }
}
