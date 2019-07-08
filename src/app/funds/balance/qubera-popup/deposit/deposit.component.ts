import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import {BalanceService} from '../../../services/balance.service';
import {select, Store} from '@ngrx/store';
import {State, getCryptoCurrenciesForChoose} from 'app/core/reducers';
import {BalanceItem} from '../../../models/balance-item.model';
import {RefillData} from '../../../../shared/interfaces/refill-data-interface';
import {RefreshAddress} from '../../../../shared/interfaces/refresh-address-interface';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})

export class DepositComponent implements OnInit {

  public cryptoNames = [];
  public defaultCryptoNames = [];
  public activeCrypto;
  public form: FormGroup;
  private cryptoDataByName;

  constructor(
    private store: Store<State>,
    public balanceService: BalanceService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.initForm();
    this.store
      .pipe(select(getCryptoCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultCryptoNames = currencies;
        this.cryptoNames = this.defaultCryptoNames;
        this.setActiveCrypto();
        if (this.activeCrypto) {
          this.getDataByCurrency(this.activeCrypto.name);
        }
      });
  }

  setActiveCrypto() {
    let currency;

    this.activeCrypto = (currency && currency.length) ? currency[0] : this.cryptoNames[0];
  }

  currencyDropdownToggle() {
    this.reqError = '';
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.cryptoNames = this.defaultCryptoNames;
    this.prepareAlphabet();
  }

  selectCurrency(currency) {
    this.activeCrypto = currency;
    this.currencyDropdownToggle();
    this.getDataByCurrency(currency.name);
  }

  initForm(){
    this.form = new FormGroup({
      amount: new FormControl(''),
    });
  }

  private getDataByCurrency(currencyName) {
    this.balanceService.getCurrencyRefillData(currencyName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
          this.cryptoDataByName = res;
          this.identifyCrypto();
        }, error => {
          this.isGenerateNewAddress = false;
          this.cryptoDataByName = null;
          const msg = this.translateService.instant('Sorry, refill is unavailable for current moment!');
          this.setError(msg);
        }
      );
  }


}
