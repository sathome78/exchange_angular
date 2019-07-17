import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BalanceService } from 'app/funds/services/balance.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-step-two-withdraw',
  templateUrl: './step-two-withdraw.component.html',
  styleUrls: ['./step-two-withdraw.component.scss']
})
export class StepTwoWithdrawComponent implements OnInit {

  form: FormGroup;
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    public balanceService: BalanceService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required)
    });
  }

  enterCode(form) {
      // this.balanceService.confirmSendWithdraw(form)
      //   .pipe(first())
      //   .subscribe((data: any) => {
      //     console.log(data);
      //   });
      this.nextStep.emit(3);
  }


}
