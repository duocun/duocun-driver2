// deprecated
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from '../../../../node_modules/@angular-redux/store';
import { IAppState } from '../../store';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { OrderService } from '../order.service';
import { IOrder, OrderStatus } from '../order.model';
import { AccountService } from '../../account/account.service';

const icons = {
  'F': {
    yellow: 'assets/images/f-yellow.png',
    green: 'assets/images/f-green.png',
    red: 'assets/images/f-red.png',
  },
  'G': {
    yellow: 'assets/images/g-yellow.png',
    green: 'assets/images/g-green.png',
    red: 'assets/images/g-red.png',
  },
};
@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();
  currLocation;
  places = [];
  orders = [];
  dateRange;
  account;
  delivered;
  phases = [];
  phase;
  deliverDate;
  loading = false;
  route = [];

  constructor(
    private rx: NgRedux<IAppState>,
    private orderSvc: OrderService,
    private accountSvc: AccountService,
  ) {
    this.currLocation = { lat: 43.8461479, lng: -79.37935279999999 };

    this.rx.select('deliverDate').pipe(takeUntil(this.onDestroy$)).subscribe((d: string) => {
      this.deliverDate = d;
    });

    this.rx.select('route').pipe(takeUntil(this.onDestroy$)).subscribe((d: any) => {
      this.route = d;
    });
  }

  ngOnInit() {
    const self = this;

    this.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
      self.account = data;
      self.reload();
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  reload() {
    const self = this;
    // const range = { $gt: moment().startOf('day').toISOString(), $lt: moment().endOf('day').toISOString() };
    const driverId = this.account._id;
    const orderQuery = {
      deliverDate: this.deliverDate,
      driverId,
      status: { $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP] }
    };
    // const fields = ['code', 'clientName', 'merchantName', 'status', 'client', 'note', 'items'];
    this.loading = true;

      this.orderSvc.find(orderQuery).pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
        const orders = data;
        const pickups = ['所有订单'];// , '10:00', '11:20']; // this.orderSvc.getPickupTimes(orders);
        const phases = [];
        let os1;

        this.loading = false;
        
        pickups.map(pickup => {
          if (pickup === '所有订单') {
            os1 = orders;
          } else {
            os1 = orders.filter(x => x.pickupTime === pickup);
          }
          // const os1 = orders.filter(x => x.delivered === this.sharedSvc.getDateTime(moment(), pickup).toISOString());
          const places = [];
          os1.forEach(order => {
            const icon = order.status === OrderStatus.DONE ? icons[order.type]['green'] : icons[order.type]['red'];

            const a = places.find(p => p && p.location.placeId === order.location.placeId);
            const location = order.location;
            if (a) {
              a.orders.push(order);
            } else {
              places.push({ status: order.status, icon: icon, name: order.clientName, location, orders: [order] });
            }
          });

          // Unfinished Order place to the last
          places.forEach(p => {
            p.orders = p.orders.sort((a, b) => {
              if (a.status === OrderStatus.DONE) {
                return -1;
              } else {
                return 1;
              }
            });
          });

          phases.push({ pickup, places, route: self.route });
        });

        self.phases = phases;


        self.phase = phases[0];
      });
  }

}
