///// ORDER BOOK //////

/**
   * Method transform exponent format to number
   * @param x
   * @returns {any}
   */
  // exponentToNumber(x) {
  //   if (Math.abs(x) < 1.0) {
  //     let e = parseInt(x.toString().split('e-')[1]);
  //     if (e) {
  //       x *= Math.pow(10, e - 1);
  //       x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
  //     }
  //   } else {
  //     let e = parseInt(x.toString().split('+')[1]);
  //     if (e > 20) {
  //       e -= 20;
  //       x /= Math.pow(10, e);
  //       x += (new Array(e + 1)).join('0');
  //     }
  //   }
  //   return x;
  // }



  // buyCalculateVisualization() {
  //   this.buyVisualizationArray = [];
  //   if (this.buyOrders[this.buyOrders.length - 1]) {
  //     this.lastCoefficient = 98 - (98 - (98 / (+this.commonBuyTotal / +this.buyOrders[this.buyOrders.length - 1].total)));
  //   }
  //   for (let i = 0; i < this.buyOrders.length; i++) {
  //       const coefficient = (+this.commonBuyTotal / +this.buyOrders[i].total);
  //       this.buyVisualizationArray.push((98 - (98 / coefficient)) + this.lastCoefficient);
  //   }
  //   this.buyVisualizationArray = [...this.buyVisualizationArray];
  // }




//////////////
// markets.component.ts


  // choosePrefPairs() {
  //   const mPairs: CurrencyPair[] = [];
  //   if (this.currencyDisplayMode === 'BTC') {
  //     const luckyBtc: CurrencyPair = this.currencyPairs.find(pair => pair.currencyPairName === 'BTC/USD');
  //     if (luckyBtc) {
  //       mPairs.push(luckyBtc);
  //     }
  //   } else if (this.currencyDisplayMode === 'ETH') {
  //     const luckyEth: CurrencyPair = this.currencyPairs.find(pair => pair.currencyPairName === 'ETH/USD');
  //     if (luckyEth) {
  //       mPairs.push(luckyEth);
  //     }
  //   }
  //   return mPairs;
  // }

  /**
  //  * Add or update pair
  //  * @param {CurrencyPair} newPair
  //  */
  // addOrUpdate(newPair: CurrencyPair) {
  //   let found = false;
  //   this.currencyPairs.forEach(elm => {
  //     if (newPair.currencyPairId === elm.currencyPairId) {
  //       found = true;
  //       const chosen = elm.isSelected;
  //       elm = newPair;
  //       elm.isSelected = chosen;
  //     }
  //   });
  //   if (!found) {
  //     this.currencyPairs.push(newPair);
  //   }
  // }
