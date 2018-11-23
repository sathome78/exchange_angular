import {FormControl, FormGroup, Validators} from '@angular/forms';


/**
 * Class with common logic for calculate orders
 */
export abstract class AbstractOrderCalculate {

  public limitForm: FormGroup;
  public stopForm: FormGroup;
  public arrPairName = ['', ''];
  /** dropdown limit data */
  public limitsData = ['LIMIT', 'STOP_LIMIT', 'ICO'];
  public currentPair;

  abstract commissionIndex;
  abstract order;
  abstract orderType;
  abstract orderStop;

  constructor() {

  }


  /**
   * init forms
   */
  initForms(): void {
    this.limitForm = new FormGroup({
      quantityOf: new FormControl('', Validators.required ),
      priceIn: new FormControl('', Validators.required ),
      totalIn: new FormControl('', Validators.required ),
    });

    this.stopForm = new FormGroup({
      quantityOf: new FormControl('', Validators.required ),
      stop: new FormControl('', ),
      limit: new FormControl('', Validators.required ),
      totalIn: new FormControl('', Validators.required ),
    });
  }

  /**
   * Get readable limit string
   * @param {string} value
   * @returns {string}
   */
  showLimit(value: string): string {
    switch (value) {
      case 'LIMIT': {
        return 'Limit order';
      }
      // case 'MARKET_PRICE': {
      //   return 'Market price';
      // }
      case 'STOP_LIMIT': {
        return 'Stop limit';
      }
      case 'ICO': {
        return 'ICO order';
      }
    }
  }

  /**
   * split pair name for showing
   */
   splitPairName() {
    if (this.currentPair.currencyPairName) {
      this.arrPairName = this.currentPair.currencyPairName.split('/');
    }
  }

  /**
   * on input in field quantity
   * @param e
   */
  quantityInput(e): void {
    this.order.amount = parseFloat(this.deleteSpace(e.target.value.toString()));
    this.setQuantityValue(e.target.value);
    this.getCommission(this.orderType);
  }

  /**
   * On input in field (price in)
   * @param e
   */
  rateInput(e): void {
    this.order.rate = parseFloat(this.deleteSpace(e.target.value.toString()));
    this.getCommission(this.orderType);
  }

  /**
   * On input in field stop
   * @param event
   */
  stopInput(event): void {
    this.orderStop = event.target.value;
  }

  /**
   * On input in field (Total in)
   * @param event
   */
  totalInput(event): void {
    this.order.total = parseFloat(this.deleteSpace(event.target.value.toString()));
    // if (this.order.total > this.userBalance) {
    //   this.order.total = this.userBalance;
    //   this.setTotalInValue(this.userBalance);
    // }
    //   if (this.order.rate > 0) {
    //     this.order.amount = this.order.total / this.order.rate;
    //     this.setQuantityValue(this.order.amount);
    //   }

    this.order.rate = this.order.total   / this.order.amount;
    this.setPriceInValue(this.order.rate);
  }

  /**
   * For delete space
   * @param value
   * @returns {string}
   */
  deleteSpace(value): string {
    if (value) {
      const replaceMask = '';
      const searchMask = ' ';
      const regex = new RegExp(searchMask, 'ig');
      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }

  /**
   * set form value (quantityOf)
   * @param value
   */
  setQuantityValue(value): void {
    value = typeof value === 'string' ? value : value.toString();
    this.stopForm.controls['quantityOf'].setValue(value);
    this.limitForm.controls['quantityOf'].setValue(value);
  }

  /**
   * set form value (priceIn/limit)
   * @param value
   */
  setPriceInValue(value): void {
    value = typeof value === 'string' ? value : !value ? '0' : value.toString();
    this.stopForm.controls['limit'].setValue(value);
    this.limitForm.controls['priceIn'].setValue(value);
  }

  /**
   * set form value (totalIn)
   * @param value
   */
  setTotalInValue(value): void {
    value = typeof value === 'string' ? value : value.toString();
    this.stopForm.controls['totalIn'].setValue(value);
    this.limitForm.controls['totalIn'].setValue(value);
  }

  /**
   * set form value (stop)
   * @param value
   */
  setStopValue(value): void {
    this.stopForm.controls['stop'].setValue(value);
  }

  /**
   * Reset forms
   */
  resetForms(): void {
    this.limitForm.reset();
    this.stopForm.reset();
  }

  /**
   * calculate commission
   */
   getCommission(operationType: string): void {
    if (this.order.rate && this.order.rate >= 0) {
      this.order.total = parseFloat(this.order.amount) * parseFloat(this.order.rate);
      this.order.commission = (this.order.rate * this.order.amount) * (this.commissionIndex / 100);
      let total;
      operationType === 'BUY' ?
        total = this.order.total + parseFloat(this.order.commission) :
        total = this.order.total - parseFloat(this.order.commission);
      this.order.total = total;
      this.setTotalInValue(total);
    }
  }

}
