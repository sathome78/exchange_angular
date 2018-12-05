import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {BalanceService} from '../../../balance.service';
import {takeUntil} from 'rxjs/operators';
import * as _uniq from 'lodash/uniq';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyBalanceModel} from '../../../../model';

@Component({
  selector: 'app-send-crypto',
  templateUrl: './send-crypto.component.html',
  styleUrls: ['./send-crypto.component.scss']
})
export class SendCryptoComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public cryptoNames: CurrencyBalanceModel[] = [];
  public defaultCryptoNames: CurrencyBalanceModel[] = [];
  public openCurrencyDropdown = false;
  public cryptoInfoByName;
  public alphabet;
  public activeCrypto;
  public form: FormGroup;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input') {
      this.openCurrencyDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
  ) { }

  ngOnInit() {
    this.initForm();

    this.balanceService.getCryptoNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.defaultCryptoNames = res;
        this.cryptoNames = this.defaultCryptoNames;
        this.activeCrypto = this.cryptoNames[0];
        this.prepareAlphabet();
        this.getCryptoInfoByName(this.activeCrypto.name);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  searchCoin(e) {
    this.cryptoNames = this.defaultCryptoNames.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  selectCurrency(currency) {
    this.activeCrypto = currency;
    this.currencyDropdownToggle();
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.cryptoNames = this.defaultCryptoNames;
    this.prepareAlphabet();
  }

  private initForm() {
    this.form = new FormGroup({
      memo: new FormControl('', [Validators.required] ),
      address: new FormControl('', [Validators.required] ),
      amount: new FormControl('', [Validators.required, this.minCheck.bind(this)] ),
    });
  }

  private getCryptoInfoByName(name: string) {

  }

  private prepareAlphabet() {
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

  private minCheck(amount: FormControl) {
    if (this.cryptoInfoByName && this.cryptoInfoByName.minRefillSum > amount.value) {
      return {'minThen': true};
    }
    return null;
  }
}
