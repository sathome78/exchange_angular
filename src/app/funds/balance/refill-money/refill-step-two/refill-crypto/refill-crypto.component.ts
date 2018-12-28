
import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _uniq from 'lodash/uniq';
import {BalanceService} from '../../../../services/balance.service';
import {select, Store} from '@ngrx/store';
import { State, getCryptoCurrenciesForChoose} from 'app/core/reducers';
import {COPY_ADDRESS} from '../../../send-money/send-money-constants';
import {BalanceItem} from '../../../../models/balance-item.model';

interface RefreshAddress {
  address: string;
  qr: string;
  message: string;
}

@Component({
  selector: 'app-refill-crypto',
  templateUrl: './refill-crypto.component.html',
  styleUrls: ['./refill-crypto.component.scss']
})
export class RefillCryptoComponent implements OnInit, OnDestroy {

  @Input() refillData: BalanceItem;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public cryptoNames = [];
  public defaultCryptoNames = [];
  public cryptoDataByName;
  public isSowCopyAddress = false;
  public isSowCopyMemoId = false;
  public activeCrypto;
  public openCurrencyDropdown = false;
  public isGenerateNewAddress = false;
  public address;
  public additionalAddress;
  public alphabet;
  public reqError = '';

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout({ target }) {
    if (target.className !== 'select__value select__value--active' &&
        target.className !== 'select__search-input' &&
        target.className !== 'select__triangle') {
      this.openCurrencyDropdown = false;
    }
  }

  constructor(
    private store: Store<State>,
    public balanceService: BalanceService,
  ) { }

  ngOnInit() {
    this.store
      .pipe(select(getCryptoCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultCryptoNames = currencies;
        this.cryptoNames = this.defaultCryptoNames;
        // this.activeCrypto = this.cryptoNames[0];
        this.setActiveCrypto();
        this.getDataByCurrency(this.activeCrypto.name);
        this.prepareAlphabet();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setActiveCrypto() {
    let currency;
    if (this.refillData && this.refillData.currencyId) {
      currency = this.cryptoNames.filter(item => +item.id === +this.refillData.currencyId);
    }
    this.activeCrypto = (currency && currency.length) ? currency[0] : this.cryptoNames[0];
  }

  currencyDropdownToggle() {
    this.reqError = '';
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
    };
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
        this.identifyCrypto();
      }, error => {
        this.cryptoDataByName = {};
      }
  );
  }

  showGenerateAddressBtn(flag: boolean) {
    if (flag) {
      this.isGenerateNewAddress = true;
    } else {
      this.isGenerateNewAddress = false;
      // setTimeout(() => this.isGenerateNewAddress = false, 500);
    }
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
          const temp = res as RefreshAddress;
          this.address = temp.address;
        }, error => {
          const msg = 'Sorry, refill is closed for current moment!';
          this.setError(msg);
        });
    }
  }

  /**
   * copy data to buffer
   * @param {string} val
   * @param {string} btn
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
      case COPY_ADDRESS:
        this.isSowCopyAddress = true;
        setTimeout(() => this.isSowCopyAddress = false, 1000);
        break;
      case 'Copy id':
        this.isSowCopyMemoId = true;
        setTimeout(() => this.isSowCopyMemoId = false, 1000);
        break;
    }
  }

  setError(message) {
    this.reqError = message;
    setTimeout(() => this.reqError = '', 5000);
  }

  private identifyCrypto() {
    const merchant = this.cryptoDataByName.merchantCurrencyData[0];
    if (merchant) {
      if (merchant.additionalTagForWithdrawAddressIsUsed) {
        this.address = merchant.mainAddress;
        this.additionalAddress = merchant.address;
      } else {
        this.address = merchant.address;
        this.additionalAddress = '';
      }
      this.showGenerateAddressBtn(this.cryptoDataByName.merchantCurrencyData[0].generateAdditionalRefillAddressAvailable);
    } else {
      this.showGenerateAddressBtn(false);
    }
  }
}


