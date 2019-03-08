import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {environment} from '../../../../../../environments/environment';
import {PopupService} from '../../../../../shared/services/popup.service';
import {RefillInnerTransferResponse} from '../../../../models/refill-inner-transfer-response.model';
import {select, Store} from '@ngrx/store';
import {getAllCurrenciesForChoose, State} from '../../../../../core/reducers';


@Component({
  selector: 'app-refill-inner-transfer',
  templateUrl: './refill-inner-transfer.component.html',
  styleUrls: ['./refill-inner-transfer.component.scss']
})
export class RefillInnerTransferComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public isSendTransferCodeSuccess = false;
  public isSendTransferCodeFail = false;
  public sendSuccessRes: RefillInnerTransferResponse;
  public allCurrencies;
  public currencyName = '';

  constructor(
    private balanceService: BalanceService,
    public popupService: PopupService,
    private store: Store<State>,
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
    });

    this.store
      .pipe(select(getAllCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.allCurrencies = currencies;
      });
  }

  sendTransferCode() {
      if (this.form.valid) {
        const data = this.form.controls['code'].value;
        this.form.reset();
        this.balanceService.sendTransferCode(data)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(res => {
            this.isSendTransferCodeSuccess = true;
            this.isSendTransferCodeFail = false;
            this.sendSuccessRes = res as RefillInnerTransferResponse;
            this.setCurrencyName(this.sendSuccessRes.currencyId);
          }, error => {
            const status = error['status'];
            // console.log('status: ' + status);
            this.isSendTransferCodeFail = true;
            this.isSendTransferCodeSuccess = false;
          });
      }

  }

  setCurrencyName(id) {
    const currency = this.allCurrencies.filter( item => item.id === id);
    this.currencyName = currency[0] ? currency[0].name : '';
  }

}
