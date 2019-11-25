///// ORDER BOOK //////

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

  // <ng-container *ngFor="let merch of merchantData">
  //     <ng-container *ngIf="merch.name === 'SimpleTransfer'">
  //       <div class="send__row">
  //         <button
  //           class="btn btn--empty-blue"
  //           (click)="chooseTransfer('By email', merch)"
  //         >{{'Instant transfer' | translate}}</button>
  //         <div class="send__transfer-description">
  //           {{'Send instant internal transfer to another account using their email' | translate}}.
  //         </div>
  //       </div>
  //     </ng-container>
  //     <ng-container *ngIf="merch.name === 'VoucherTransfer'">
  //       <div class="send__row">
  //         <button
  //           class="btn btn--empty-blue"
  //           (click)="chooseTransfer('By code', merch)"
  //         >
  //           {{'Protected by code & mail' | translate}}
  //         </button>
  //         <div
  //           class="send__transfer-description"
  //           [innerHTML]="'Make <b>password-protected</b> personal transfer to another user by his <b>email</b>' | translate"
  //         >
  //           <div class="small">({{'user can get the money if he knows the transfer code' | translate}})</div>
  //         </div>
  //       </div>
  //     </ng-container>
  //     <ng-container *ngIf="merch.name === 'VoucherFreeTransfer'">
  //       <div class="send__row">
  //         <button
  //           class="btn btn--empty-blue"
  //           (click)="chooseTransfer('By private code', merch)"
  //         >{{'Protected by code only' | translate}}</button>
  //         <div
  //           class="send__transfer-description"
  //           [innerHTML]="'Make <b>password-protected</b> transfer' | translate"
  //         >

  //           <div class="small">{{'Anyone who knows the code may recive the transfer' | translate}}</div>
  //         </div>
  //       </div>
  //     </ng-container>
  //   </ng-container>
