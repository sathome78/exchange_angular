import * as dashboard from '../actions/dashboard.actions';

export interface State {
  currencyPair: string;
}

export const INIT_STATE: State = {
  currencyPair: null,
};

/**
 * Exports reducing function
 * @param state
 * @param action
 */
export function reducer(state: State = INIT_STATE, action: dashboard.Actions) {
  switch (action.type) {
    case dashboard.CHANGE_CURRENCY_PAIR:
      return {...state, ...action.payload};

    default :
      return state;
  }
}

/**
 * Selector returns current currency pair
 */
export const getCurrencyPair = (state: State): string => state.currencyPair;
