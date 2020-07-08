import { IAccount } from '../account/account.model';
import { ILocation } from '../location/location.model';
import { IRange } from '../range/range.model';

export interface IDeliveryTime {
  text?: string;
  from?: Date;
  to?: Date;
}

export interface IDelivery {
  origin?: ILocation;         // client location
  destination?: ILocation;    // mall location
  deliverDate: string;
  deliverTime: string;
}
