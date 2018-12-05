import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MockDataService} from '../../../../services/mock-data.service';
import {BalanceService} from '../../../balance.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _uniq from 'lodash/uniq';

@Component({
  selector: 'app-refill-crypto',
  templateUrl: './refill-crypto.component.html',
  styleUrls: ['./refill-crypto.component.scss']
})
export class RefillCryptoComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public cryptoNames = [];
  public defaultCryptoNames = [];
  public cryptoDataByName;
  public isSowCopyAddress = false;
  public isSowCopyMemoId = false;
  public activeCrypto;
  public openCurrencyDropdown = false;
  public alphabet;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input' ) {
      this.openCurrencyDropdown = false;
    }
  }

  constructor(
    public mockDataService: MockDataService,
    public balanceService: BalanceService,
  ) { }

  ngOnInit() {
    /**-------mock data------**/
    // this.defaultCryptoNames = this.mockDataService.getCryptoName();
    // this.cryptoNames = this.defaultCryptoNames;
    // this.cryptoDataByName = this.mockDataService.getCryptoData();
    // this.prepareAlphabet();
    /**----------------------**/
    this.balanceService.getCryptoNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
      this.defaultCryptoNames = res;
      this.cryptoNames = this.defaultCryptoNames;
      this.activeCrypto = this.cryptoNames[0];
      this.getDataByCurrency(this.activeCrypto.name);
      console.log(this.cryptoNames)
        this.prepareAlphabet();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.cryptoNames = this.defaultCryptoNames;
    this.prepareAlphabet();
  }

  prepareAlphabet() {
    const temp = [];
    this.cryptoNames.forEach(currency => {
      const letter = currency.name.toUpperCase()[0];
      temp.push(letter);
    });
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    }
    this.alphabet = _uniq(temp.filter(unique).sort());
  }

  selectCurrency(currency) {
    this.activeCrypto = currency;
    this.currencyDropdownToggle();
    this.getDataByCurrency(currency.name);
  }

  private getDataByCurrency(currencyName) {
    this.balanceService.getCurrencyData(currencyName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.cryptoDataByName = res;
        console.log(res);
      });
  }

  searchCoin(e) {
    this.cryptoNames = this.defaultCryptoNames.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  generateNewAddress() {
    if (this.cryptoDataByName && this.cryptoDataByName.merchantCurrencyData[0].generateAdditionalRefillAddressAvailable) {
      const data = {
        operationType: this.cryptoDataByName.payment.operationType,
        currency: this.cryptoDataByName.merchantCurrencyData[0].currencyId,
        merchant: this.cryptoDataByName.merchantCurrencyData[0].merchantId,
        sum: 0
      };
      this.balanceService.refill(data)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
        this.cryptoDataByName = res;
      });
    }
  }

  /**
   * copy data to buffer
   * @param {string} val
   */
  copyToBuffer(val: string, btn: string) {
    this.changeCopyBtn(btn);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  private changeCopyBtn (name: string) {
    switch (name) {
      case 'Copy address':
        this.isSowCopyAddress = true;
        setTimeout(() => this.isSowCopyAddress = false, 1000);
        break;
      case 'Copy id':
        this.isSowCopyMemoId = true;
        setTimeout(() => this.isSowCopyMemoId = false, 1000);
        break;
    }
  }
}
