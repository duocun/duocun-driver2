import { IDelivery } from './delivery.model';
import { DeliveryActions } from './delivery.actions';
import * as moment from 'moment';

export const DEFAULT_DELIVER_DATE = moment().format('YYYY-MM-DD');

export const DEFAULT_DELIVERY = {
  origin: null,
  destination: null,
  deliverDate: moment().format('YYYY-MM-DD'),
  deliverTime: '11:00'
};

export interface IDeliveryAction {
  type: string;
  payload: any;
}

export const deliverDateReducer = (state: string = DEFAULT_DELIVER_DATE, action: any) => {
  switch (action.type) {
    case DeliveryActions.SET_DELIVER_DATE:
      return action.payload;
  }
  return state;
};

export function deliveryReducer(state: IDelivery = DEFAULT_DELIVERY, action: IDeliveryAction) {
  if (action && action.type === DeliveryActions.UPDATE_DELIVER_DATE) {
    return {...state, deliverDate: action.payload };
  }

  return state;
  // switch (action.type) {
  //   case DeliveryActions.CLEAR:
  //     return null;
  //   case DeliveryActions.UPDATE:
  //     return action.payload;
  //   case DeliveryActions.UPDATE_TIME_AND_RANGES:
  //     return {
  //       ...state,
  //       availableRanges: action.payload.availableRanges,
  //       fromTime: action.payload.fromTime,
  //       toTime: action.payload.toTime
  //     };
  //   case DeliveryActions.UPDATE_ORIGIN:
  //     return {
  //       ...state,
  //       origin: action.payload.origin
  //     };
  //   case DeliveryActions.UPDATE_DESTINATION:
  //     return {
  //       ...state,
  //       destination: action.payload.destination,
  //       distance: action.payload.distance
  //     };
  //   case DeliveryActions.UPDATE_DISTANCE:
  //     return {
  //       ...state,
  //       distance: action.payload.distance
  //     };
  //   case DeliveryActions.UPDATE_AVAILABLE_RANGES:
  //     return {
  //       ...state,
  //       availableRanges: action.payload.availableRanges
  //     };
  //   case DeliveryActions.UPDATE_FROM_CHANGE_ORDER:
  //     return {
  //       ...state,
  //       fromTime: action.payload.fromTime,
  //       toTime: action.payload.toTime,
  //       origin: action.payload.origin,
  //       destination: action.payload.destination,
  //       distance: action.payload.distance
  //     };
  //   default:
  //     return state || null;
  // }
}
