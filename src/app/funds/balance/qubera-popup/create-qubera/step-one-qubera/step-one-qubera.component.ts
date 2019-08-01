import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BalanceService } from 'app/funds/services/balance.service';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_MESSAGES } from 'app/shared/constants';

@Component({
  selector: 'app-step-one-qubera',
  templateUrl: './step-one-qubera.component.html',
  styleUrls: ['./step-one-qubera.component.scss'],
})
export class StepOneQuberaComponent implements OnInit {
  @Input() qubera;
  @Output() closeQuberaPopup = new EventEmitter<boolean>();
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();
  step: number;

  form: FormGroup;
  statusMessage: string = '';

  constructor(private translateService: TranslateService, private balanceService: BalanceService) {}

  ngOnInit() {
    this.initForm();
    this.getCodeToCreateQuberaAccount();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required),
    });
  }

  enterCode(form) {
    if (this.form.valid) {
      this.balanceService
        .createQuberaAccount({ pin: form.code })
        .pipe(first())
        .subscribe(
          (data: any) => {
            this.nextStep.emit(2);
          },
          error => {
            this.setStatusMessage(error);
          }
        );
    }
  }

  setStatusMessage(err) {
    if (err['status'] === 400) {
      this.form.reset();
      this.statusMessage = 'Wrong code';
    }
  }

  getCodeToCreateQuberaAccount() {
    this.balanceService
      .sendCodeToMail()
      .pipe(first())
      .subscribe((code: string) => {}, error => {});
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
