import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BalanceService } from 'app/funds/services/balance.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-step-one-qubera',
  templateUrl: './step-one-qubera.component.html',
  styleUrls: ['./step-one-qubera.component.scss']
})
export class StepOneQuberaComponent implements OnInit {

  @Input() qubera;
  @Output() closeQuberaPopup = new EventEmitter<boolean>();
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();
  step: number;

  form: FormGroup;

  constructor(
    private balanceService: BalanceService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getCodeToCreateQuberaAccount();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required)
    })
  }

  enterCode(form) {
    if(this.form.valid) {
      this.balanceService.createQuberaAccount({pin: form.code})
        .pipe(first())
        .subscribe((data: any) => {
          this.nextStep.emit(2);
        }, error => {
          console.log(error);
        });
    }
  }

  getCodeToCreateQuberaAccount() {
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

  onCloseQuberaPopup() {
    setTimeout(() => {
      this.closeQuberaPopup.emit(true);
    }, 1000);
  }

}
