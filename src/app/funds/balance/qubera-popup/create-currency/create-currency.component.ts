import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BalanceService } from 'app/funds/services/balance.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-create-currency',
  templateUrl: './create-currency.component.html',
  styleUrls: ['./create-currency.component.scss']
})
export class CreateCurrencyComponent implements OnInit {

  @Input() qubera;
  @Input() steper;
  @Output() closeSendQuberaPopup = new EventEmitter<boolean>();
  step: number;

  form: FormGroup;

  constructor(
    private balanceService: BalanceService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getCodeToCreateCurrency();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required)
    })
  }

  setStep(steper) {
    this.step = steper;
  }

  enterCode(form) {
    if(this.form.valid) {
      this.balanceService.createCurrency({pin: form.code})
        .pipe(first())
        .subscribe((data: any) => {
          
        }, error => {
          console.log(error);
        });
    }
  }

  getCodeToCreateCurrency() {
    this.balanceService.sendCodeToMail()
      .pipe(first())
      .subscribe((code: string) => {
        
      }, error => {
        console.log(error);
      });
  }

  
  get currentCode(): any {
    return this.form.get('code');
  }

  onCloseSendMoneyPopup() {
    setTimeout(() => {
      this.closeSendQuberaPopup.emit(true);
    }, 1000);
  }

}
