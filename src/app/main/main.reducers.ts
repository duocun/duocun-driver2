import { PageActions} from './main.actions';

export const DEFAULT_PAGE = 'home';

export interface IPageAction {
  type: string;
  payload: any;
}

export function pageReducer(state: string = 'home', action: IPageAction) {
  if (action.payload) {
    switch (action.type) {
      case PageActions.SET_PAGE:
        return action.payload;
    }
  }

  return state;
}



