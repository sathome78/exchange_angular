import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BalanceService } from 'app/funds/services/balance.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-step-one-currency',
  templateUrl: './step-one-currency.component.html',
  styleUrls: ['./step-one-currency.component.scss']
})
export class StepOneCurrencyComponent implements OnInit {

  @Input() qubera;
  @Input() steper;
  @Output() closeSendQuberaPopup = new EventEmitter<boolean>();
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();
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

  enterCode(form) {
    if(this.form.valid) {
      this.balanceService.createCurrency({pin: form.code})
        .pipe(first())
        .subscribe((data: any) => {
          
          this.nextStep.emit(2);
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
