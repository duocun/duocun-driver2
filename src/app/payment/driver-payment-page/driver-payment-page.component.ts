import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil, take } from '../../../../node_modules/rxjs/operators';
import { Role, IAccount } from '../../account/account.model';
// import { IDriverPayment, IDriverPaymentData, IDriverBalance } from '../../payment/payment.model';
import { MatSnackBar, MatPaginator, MatSort } from '../../../../node_modules/@angular/material';
import * as moment from 'moment';

import { MatTableDataSource } from '@angular/material/table';
import { TransactionService } from '../../transaction/transaction.service';
import { ITransaction, ITransactionData, TransactionAction } from '../../transaction/transaction.model';
import { IDriverPayment, IDriverPaymentData } from '../payment.model';

@Component({
  selector: 'app-driver-payment-page',
  templateUrl: './driver-payment-page.component.html',
  styleUrls: ['./driver-payment-page.component.scss']
})
export class DriverPaymentPageComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  account;
  alexcredits;
  displayedColumns: string[] = ['date', 'description', 'received', 'paid', 'balance'];
  list = [];
  currentPageNumber = 1;
  itemsPerPage = 15;
  transactions = [];
  nTransactions = 0;
  loading = true;
  highlightedId = 0;

  constructor(
    private accountSvc: AccountService,
    private transactionSvc: TransactionService
  ) {

  }

  ngOnInit() {
    const self = this;
    this.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe(({data}) => {
      const account = data;
      this.account = account;
      if (account) {
        this.OnPageChange(this.currentPageNumber);
      } else {

      }
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
  getDescription(t, driverId) {
    if (t.actionCode === TransactionAction.CANCEL_ORDER_FROM_DUOCUN.code) {
      return '取消' + t.toName;
    } else if (t.actionCode === TransactionAction.PAY_BY_CARD.code) {
      return '银行卡付款';
    } else if (t.actionCode === TransactionAction.PAY_BY_WECHAT.code) {
      return '微信付款';
    } else if (t.actionCode === TransactionAction.PAY_DRIVER_CASH.code) {
      return '现金付款';
    } else if (t.actionCode === TransactionAction.ADD_CREDIT_BY_CARD.code) {
      return '信用卡充值';
    } else if (t.actionCode === TransactionAction.ADD_CREDIT_BY_WECHAT.code) {
      return '微信充值';
    } else if (t.actionCode === TransactionAction.PAY_MERCHANT_CASH.code) {
      return t.toName;
    } else if (t.actionCode === TransactionAction.TRANSFER.code && t.fromId === driverId) {
      return '转给' + t.toName;
    } else if (t.actionCode === TransactionAction.TRANSFER.code && t.toId === driverId) {
      return '转自' + t.fromName;
    } else {
      return t.fromId === driverId ? t.toName : t.fromName;
    }
  }

  OnPageChange(pageNumber) {
    const itemsPerPage = this.itemsPerPage;
    const driverId = this.account._id;

    this.loading = true;
    this.currentPageNumber = pageNumber;
    const query = { $or: [{ fromId: driverId }, { toId: driverId }], amount: { $ne: 0 } };
    this.transactionSvc.loadPage(query, pageNumber, itemsPerPage).pipe(takeUntil(this.onDestroy$)).subscribe((ret: any) => {
      this.nTransactions = ret.total;
      const list = [];
      ret.transactions.map(t => {
        const b = t.fromId === driverId ? t.fromBalance : t.toBalance;
        const description = this.getDescription(t, driverId);
        const received = t.toId === driverId ? t.amount : 0;
        const paid = t.fromId === driverId ? t.amount : 0;
        list.push({ date: t.created, description: description, received: received, paid: paid, balance: -b });
      });

      this.transactions = list;
      // this.dataSource = new MatTableDataSource(list);
      this.loading = false;
    });
  }
}




