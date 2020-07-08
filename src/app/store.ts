import { Action } from 'redux';
import { combineReducers } from 'redux';
import { accountReducer } from './account/account.reducer';
// import { pictureReducer } from './commerce/commerce.reducers';
import { locationReducer } from './location/location.reducer';
import { ILocation } from './location/location.model';
// import { IPicture, DEFAULT_PICTURE } from './commerce/commerce.actions';
import { pageReducer, DEFAULT_PAGE } from './main/main.reducers';
import { commandReducer, ICommand } from './shared/command.reducers';
import { IDelivery } from './delivery/delivery.model';
import { deliveryReducer, DEFAULT_DELIVERY } from './delivery/delivery.reducer';
import { IContact } from './contact/contact.model';
import { contactReducer } from './contact/contact.reducer';
import { restaurantReducer } from './restaurant/restaurant.reducer';
import { IMerchant } from './restaurant/restaurant.model';
import { Account } from './account/account.model';

export interface IAppState {
    account: Account;
    // picture: IPicture;
    location: ILocation;
    page: string;
    cmd: ICommand;
    // deliveryTime: IDeliveryTime;
    restaurant: IMerchant;
    delivery: IDelivery;
    contact: IContact;
}

export const INITIAL_STATE: IAppState = {
    account: null,
    // picture: DEFAULT_PICTURE,
    location: null,
    page: DEFAULT_PAGE,
    cmd: {name: '', args: ''},
    // deliveryTime: {text: '', from: null, to: null},
    restaurant: null,
    delivery: DEFAULT_DELIVERY,
    contact: null,
};

// export function rootReducer(last:IAppState, action:Action):IAppState{
// 	// switch (action.type){
// 	// 	case DashboardActions.SHOW_DASHBOARD:
// 	// 		return { dashboard: 'main' };
// 	// 	case DashboardActions.HIDE_DASHBOARD:
// 	// 		return { dashboard: ''};
// 	// }
// 	return last;
// }

export const rootReducer = combineReducers({
    account: accountReducer,
    // picture: pictureReducer,
    location: locationReducer,
    page: pageReducer,
    cmd: commandReducer,
    // deliveryTime: deliveryTimeReducer,
    restaurant: restaurantReducer,
    delivery: deliveryReducer,
    contact: contactReducer
});
