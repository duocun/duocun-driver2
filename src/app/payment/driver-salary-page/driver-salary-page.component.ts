import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import * as moment from 'moment';
import { MatTableDataSource, MatPaginator, MatSort } from '../../../../node_modules/@angular/material';
import { ISalaryData } from '../../payment/payment.model';
import { AccountService } from '../../account/account.service';
import { Role } from '../../account/account.model';
import { DriverHourService } from '../driver-hour.service';
import { OrderService } from '../../order/order.service';


@Component({
  selector: 'app-driver-salary-page',
  templateUrl: './driver-salary-page.component.html',
  styleUrls: ['./driver-salary-page.component.scss']
})
export class DriverSalaryPageComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  drivers;
  selectedDriver;
  displayedColumns: string[] = ['date', 'hours', 'nOrders', 'balance'];
  dataSource: MatTableDataSource<ISalaryData>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private orderSvc: OrderService,
    private accountSvc: AccountService,
    private driverHourSvc: DriverHourService
  ) {

  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe(({data}) => {
      const account = data;
      if (account && account.roles) {
        const roles = account.roles;
        if (roles && roles.length > 0 && roles.indexOf(Role.DRIVER) !== -1) {
          self.reload(account.id);
        }
      } else {

      }
    });
  }

  reload(driverId) {
    this.driverHourSvc.find({ driverId: driverId }).pipe(takeUntil(this.onDestroy$)).subscribe((overtimes) => {

      this.orderSvc.find({ driverId: driverId }).pipe(takeUntil(this.onDestroy$)).subscribe(({data}) => {
        const orders = data;
        const groups = this.groupBy(orders, 'delivered');
        const salaryItems = [];
        const dates = Object.keys(groups);
        let balance = 0;
        const m = moment('2019-07-21');

        dates.map(date => {
          const overtime = overtimes.find(ot => ot.delivered === date); // fix me! one day pay twice
          const hours = moment(date).isAfter(m) ? 1.5 : 2;

          const group = groups[date]; // orders
          if (group && group.length > 0) {
            balance += hours * 30;
            const a = group[0];
            salaryItems.push({
              date: a.delivered, driverId: a.driverId, driverName: a.driver.username, nOrders: group.length,
              hours: overtime ? overtime.hours : hours, balance: balance
            });
          }
        });

        salaryItems.sort((a, b) => {
          const aMoment = moment(a.date);
          const bMoment = moment(b.date);
          if (aMoment.isAfter(bMoment)) {
            return -1;
          } else {
            return 1;
          }
        });
        this.dataSource = new MatTableDataSource(salaryItems);
      });
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  groupBy(items, key) {
    return items.reduce((result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), {});
  }
}
