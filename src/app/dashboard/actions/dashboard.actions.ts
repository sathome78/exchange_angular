import {Action} from '@ngrx/store';

export const CHANGE_CURRENCY_PAIR = '[Dashboard] Change currency pair';

/**
 * Change currency pair 'BTC/USD'
 */
export class ChangeCurrencyPairAction implements Action {
  readonly type = CHANGE_CURRENCY_PAIR;

  /**
   * Default constructor
   * @param payload
   */
  constructor(public payload) {}
}

/**
 * Exports possible action types
 */
export type Actions = ChangeCurrencyPairAction;
